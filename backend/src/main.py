import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
from datetime import datetime, timedelta
import jwt
import bcrypt

# Configuração da aplicação Flask
app = Flask(__name__, static_folder='static')
CORS(app)

# Configuração do JWT
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'financas-pro-secret-key')
app.config['JWT_EXPIRATION_DELTA'] = timedelta(days=7)

# Simulação de banco de dados em memória
db = {
    'users': [
        {
            'id': 1,
            'name': 'Usuário Demo',
            'email': 'demo@financaspro.com',
            'password': bcrypt.hashpw('senha123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            'role': 'admin'
        }
    ],
    'accounts': [
        {
            'id': 1,
            'user_id': 1,
            'name': 'Nubank',
            'type': 'checking',
            'balance': 3240.75
        },
        {
            'id': 2,
            'user_id': 1,
            'name': 'Itaú',
            'type': 'savings',
            'balance': 2000.00
        }
    ],
    'credit_cards': [
        {
            'id': 1,
            'user_id': 1,
            'name': 'Nubank',
            'limit': 8000.00,
            'used': 5200.00,
            'due_date': 10
        },
        {
            'id': 2,
            'user_id': 1,
            'name': 'Itaú',
            'limit': 5000.00,
            'used': 1500.00,
            'due_date': 15
        }
    ],
    'transactions': [
        {
            'id': 1,
            'user_id': 1,
            'description': 'Supermercado Extra',
            'category': 'Alimentação',
            'date': '2025-06-10',
            'amount': -350.75,
            'account': 'Nubank',
            'status': 'confirmed'
        },
        {
            'id': 2,
            'user_id': 1,
            'description': 'Salário',
            'category': 'Receita',
            'date': '2025-06-05',
            'amount': 7500.00,
            'account': 'Itaú',
            'status': 'confirmed'
        },
        {
            'id': 3,
            'user_id': 1,
            'description': 'Netflix',
            'category': 'Lazer',
            'date': '2025-06-08',
            'amount': -39.90,
            'account': 'Nubank',
            'status': 'pending'
        },
        {
            'id': 4,
            'user_id': 1,
            'description': 'Farmácia',
            'category': 'Saúde',
            'date': '2025-06-12',
            'amount': -125.30,
            'account': 'Cartão Itaú',
            'status': 'confirmed'
        },
        {
            'id': 5,
            'user_id': 1,
            'description': 'Uber',
            'category': 'Transporte',
            'date': '2025-06-14',
            'amount': -28.50,
            'account': 'Nubank',
            'status': 'pending'
        }
    ],
    'imported_transactions': [
        {
            'id': 101,
            'user_id': 1,
            'description': 'SUPERMERCADO EXTRA',
            'date': '2025-06-10',
            'amount': -350.75,
            'account': 'Nubank',
            'status': 'imported'
        },
        {
            'id': 102,
            'user_id': 1,
            'description': 'NETFLIX',
            'date': '2025-06-08',
            'amount': -39.90,
            'account': 'Nubank',
            'status': 'imported'
        },
        {
            'id': 103,
            'user_id': 1,
            'description': 'FARMACIA DROGA RAIA',
            'date': '2025-06-12',
            'amount': -125.30,
            'account': 'Itaú',
            'status': 'imported'
        },
        {
            'id': 104,
            'user_id': 1,
            'description': 'UBER *TRIP',
            'date': '2025-06-14',
            'amount': -28.50,
            'account': 'Nubank',
            'status': 'imported'
        }
    ],
    'categories': [
        {'id': 1, 'user_id': 1, 'name': 'Moradia', 'color': '#a78bfa', 'type': 'expense'},
        {'id': 2, 'user_id': 1, 'name': 'Alimentação', 'color': '#f472b6', 'type': 'expense'},
        {'id': 3, 'user_id': 1, 'name': 'Transporte', 'color': '#4ade80', 'type': 'expense'},
        {'id': 4, 'user_id': 1, 'name': 'Saúde', 'color': '#38bdf8', 'type': 'expense'},
        {'id': 5, 'user_id': 1, 'name': 'Lazer', 'color': '#fb923c', 'type': 'expense'},
        {'id': 6, 'user_id': 1, 'name': 'Educação', 'color': '#f87171', 'type': 'expense'},
        {'id': 7, 'user_id': 1, 'name': 'Outros', 'color': '#c084fc', 'type': 'expense'},
        {'id': 8, 'user_id': 1, 'name': 'Receita', 'color': '#22c55e', 'type': 'income'}
    ]
}

# Middleware para verificar token JWT
def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        
        # Verificar se o token está no header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token não fornecido!'}), 401
        
        try:
            # Decodificar o token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = next((user for user in db['users'] if user['id'] == data['user_id']), None)
            
            if not current_user:
                return jsonify({'message': 'Usuário não encontrado!'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido!'}), 401
            
        return f(current_user, *args, **kwargs)
    
    decorated.__name__ = f.__name__
    return decorated

# Rota de autenticação
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Dados de login incompletos!'}), 400
        
    user = next((user for user in db['users'] if user['email'] == data['email']), None)
    
    if not user or not bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({'message': 'Credenciais inválidas!'}), 401
        
    # Gerar token JWT
    token = jwt.encode({
        'user_id': user['id'],
        'exp': datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role']
        }
    })

# Rota para obter resumo do dashboard
@app.route('/api/dashboard/summary', methods=['GET'])
@token_required
def get_dashboard_summary(current_user):
    # Calcular saldo total
    total_balance = sum(account['balance'] for account in db['accounts'] if account['user_id'] == current_user['id'])
    
    # Calcular despesas do mês
    expenses = sum(transaction['amount'] for transaction in db['transactions'] 
                  if transaction['user_id'] == current_user['id'] 
                  and transaction['amount'] < 0 
                  and transaction['date'].startswith('2025-06'))
    
    # Calcular receitas do mês
    income = sum(transaction['amount'] for transaction in db['transactions'] 
                if transaction['user_id'] == current_user['id'] 
                and transaction['amount'] > 0 
                and transaction['date'].startswith('2025-06'))
    
    # Calcular limite disponível
    total_limit = sum(card['limit'] for card in db['credit_cards'] if card['user_id'] == current_user['id'])
    used_limit = sum(card['used'] for card in db['credit_cards'] if card['user_id'] == current_user['id'])
    available_limit = total_limit - used_limit
    limit_usage_percentage = int((used_limit / total_limit) * 100) if total_limit > 0 else 0
    
    return jsonify({
        'totalBalance': total_balance,
        'balanceChange': 12,  # Simulado
        'expenses': abs(expenses),
        'expenseChange': 15,  # Simulado
        'income': income,
        'incomeChange': 0,    # Simulado
        'availableLimit': available_limit,
        'limitUsagePercentage': limit_usage_percentage
    })

# Rota para obter despesas por categoria
@app.route('/api/dashboard/expenses-by-category', methods=['GET'])
@token_required
def get_expenses_by_category(current_user):
    # Calcular despesas por categoria
    expenses_by_category = {}
    
    for transaction in db['transactions']:
        if transaction['user_id'] == current_user['id'] and transaction['amount'] < 0 and transaction['date'].startswith('2025-06'):
            category = transaction['category']
            if category not in expenses_by_category:
                expenses_by_category[category] = 0
            expenses_by_category[category] += abs(transaction['amount'])
    
    # Formatar resultado
    result = []
    for category_name, value in expenses_by_category.items():
        category = next((c for c in db['categories'] if c['name'] == category_name), None)
        if category:
            result.append({
                'id': category['id'],
                'name': category_name,
                'color': category['color'],
                'value': value
            })
    
    return jsonify(result)

# Rota para obter comparação mensal
@app.route('/api/dashboard/monthly-comparison', methods=['GET'])
@token_required
def get_monthly_comparison(current_user):
    # Dados simulados para os últimos 5 meses
    months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai']
    
    result = [
        {'month': 'Jan', 'income': 7500, 'expenses': 2200},
        {'month': 'Fev', 'income': 7500, 'expenses': 2000},
        {'month': 'Mar', 'income': 7500, 'expenses': 1950},
        {'month': 'Abr', 'income': 7500, 'expenses': 1900},
        {'month': 'Mai', 'income': 7500, 'expenses': 2150}
    ]
    
    return jsonify(result)

# Rota para obter transações
@app.route('/api/transactions', methods=['GET'])
@token_required
def get_transactions(current_user):
    user_transactions = [t for t in db['transactions'] if t['user_id'] == current_user['id']]
    return jsonify(user_transactions)

# Rota para importar Excel
@app.route('/api/import/excel', methods=['POST'])
@token_required
def import_excel(current_user):
    # Verificar se há um arquivo na requisição
    if 'file' not in request.files:
        return jsonify({'message': 'Nenhum arquivo enviado!'}), 400
    
    file = request.files['file']
    
    # Verificar se o nome do arquivo está vazio
    if file.filename == '':
        return jsonify({'message': 'Nome de arquivo vazio!'}), 400
    
    # Verificar se é um arquivo Excel
    if not file.filename.endswith(('.xlsx', '.xls')):
        return jsonify({'message': 'Formato de arquivo inválido! Apenas arquivos Excel (.xlsx, .xls) são aceitos.'}), 400
    
    # Simular processamento do arquivo
    if 'mapping' in request.form:
        # Etapa de importação final
        return jsonify({
            'totalRows': 50,
            'importedRows': 47,
            'errors': [
                {'row': 5, 'message': 'Formato de data inválido'},
                {'row': 12, 'message': 'Valor não numérico'},
                {'row': 23, 'message': 'Categoria não reconhecida'}
            ]
        })
    else:
        # Etapa de mapeamento de colunas
        return jsonify({
            'columns': [
                {'source': 'Data', 'target': 'date', 'status': 'mapped'},
                {'source': 'Descrição', 'target': 'description', 'status': 'mapped'},
                {'source': 'Valor', 'target': 'amount', 'status': 'mapped'},
                {'source': 'Categoria', 'target': 'category', 'status': 'mapped'},
                {'source': 'Conta', 'target': 'account', 'status': 'mapped'},
                {'source': 'Observações', 'target': None, 'status': 'unmapped'}
            ]
        })

# Rota para obter itens de conciliação
@app.route('/api/conciliation/items', methods=['GET'])
@token_required
def get_conciliation_items(current_user):
    imported = [t for t in db['imported_transactions'] if t['user_id'] == current_user['id']]
    existing = [t for t in db['transactions'] if t['user_id'] == current_user['id']]
    
    return jsonify({
        'imported': imported,
        'existing': existing
    })

# Rota para conciliar transações
@app.route('/api/conciliation/match', methods=['POST'])
@token_required
def conciliate_transactions(current_user):
    data = request.get_json()
    
    if not data or 'importedId' not in data or 'existingId' not in data:
        return jsonify({'message': 'Dados incompletos!'}), 400
    
    imported_id = data['importedId']
    existing_id = data['existingId']
    
    # Simular conciliação
    # Em um sistema real, atualizaríamos o banco de dados
    
    return jsonify({'success': True})

# Rota para ignorar conciliação
@app.route('/api/conciliation/ignore', methods=['POST'])
@token_required
def ignore_conciliation(current_user):
    data = request.get_json()
    
    if not data or 'importedId' not in data:
        return jsonify({'message': 'Dados incompletos!'}), 400
    
    imported_id = data['importedId']
    
    # Simular ignorar conciliação
    # Em um sistema real, atualizaríamos o banco de dados
    
    return jsonify({'success': True})

# Rota para verificar status da API
@app.route('/api/status', methods=['GET'])
def api_status():
    return jsonify({
        'status': 'online',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })

# Rota para servir o frontend em produção
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    # Em produção, o frontend será servido pelo backend
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Configurar porta para Heroku
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
