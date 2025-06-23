import React from 'react';
import { FaHeart, FaCode, FaGithub, FaLinkedin, FaRobot } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='site-footer'>
      <div className='footer-content'>
        <div className='creator-signature'>
          <div className='creator-info'>
            <div className='creator-avatar'>
              <img
                src='/assets/Karla_avatar.png'
                alt='Karla Daiany'
                className='avatar-image'
                onError={e => {
                  // Fallback para iniciais se a imagem não carregar
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className='avatar-fallback' style={{ display: 'none' }}>
                KD
              </div>
            </div>
            <div className='creator-details'>
              <span className='creator-name'>Karla Daiany</span>
              <span className='creator-role'>
                QA Lead
                <FaRobot className='robot-icon' />
                Automation
              </span>
            </div>
          </div>

          <div className='creation-info'>
            <span className='made-with'>
              Feito com <FaHeart className='heart-icon' /> e{' '}
              <FaCode className='code-icon' />
            </span>
            <span className='copyright'>
              © {new Date().getFullYear()} - Sistema KQA
            </span>
          </div>

          <div className='social-links'>
            <a
              href='https://github.com/karladaiany'
              target='_blank'
              rel='noopener noreferrer'
              className='social-link'
              title='GitHub'
            >
              <FaGithub />
            </a>
            <a
              href='https://www.linkedin.com/in/karla-daiany-guimaraes-camargo-de-oliveira'
              target='_blank'
              rel='noopener noreferrer'
              className='social-link'
              title='LinkedIn'
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
