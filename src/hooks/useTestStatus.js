import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'testStatusData';

const getInitialData = () => {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      return {
        initialActivityType: parsedData.activityType || 'manual',
        initialTestStatus: parsedData.testStatus || '',
        initialEnvironment: parsedData.environment || '',
        initialFormData: {
          observation: parsedData.formData?.observation || '',
          waiting: parsedData.formData?.waiting || '',
          validation: parsedData.formData?.validation || '',
          information: parsedData.formData?.information || '',
          blockReason: parsedData.formData?.blockReason || '',
          returnReason: parsedData.formData?.returnReason || '',
          evidenceDescription: parsedData.formData?.evidenceDescription || '',
          evidenceLink: parsedData.formData?.evidenceLink || '',
          hasAttachment: parsedData.formData?.hasAttachment || false,
          testPlan: parsedData.formData?.testPlan || '',
          build: parsedData.formData?.build || '',
          testCaseIds: parsedData.formData?.testCaseIds || '',
          pullRequest: parsedData.formData?.pullRequest || '',
        },
      };
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
      return {
        initialActivityType: 'manual',
        initialTestStatus: '',
        initialEnvironment: '',
        initialFormData: {
          observation: '',
          waiting: '',
          validation: '',
          information: '',
          blockReason: '',
          returnReason: '',
          evidenceDescription: '',
          evidenceLink: '',
          hasAttachment: false,
          testPlan: '',
          build: '',
          testCaseIds: '',
          pullRequest: '',
        },
      };
    }
  }
  return {
    initialActivityType: 'manual',
    initialTestStatus: '',
    initialEnvironment: '',
    initialFormData: {
      observation: '',
      waiting: '',
      validation: '',
      information: '',
      blockReason: '',
      returnReason: '',
      evidenceDescription: '',
      evidenceLink: '',
      hasAttachment: false,
      testPlan: '',
      build: '',
      testCaseIds: '',
      pullRequest: '',
    },
  };
};

export const useTestStatus = () => {
  const {
    initialActivityType,
    initialTestStatus,
    initialEnvironment,
    initialFormData,
  } = getInitialData();

  const [activityType, setActivityType] = useState(initialActivityType);
  const [testStatus, setTestStatus] = useState(initialTestStatus);
  const [environment, setEnvironment] = useState(initialEnvironment);
  const [formData, setFormData] = useState(initialFormData);

  // Salva os dados no localStorage sempre que houver mudanças
  useEffect(() => {
    const dataToSave = {
      activityType,
      testStatus,
      environment,
      formData,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [activityType, testStatus, environment, formData]);

  const handleActivityTypeChange = e => {
    setActivityType(e.target.value);
    // Reset status when changing activity type
    setTestStatus('');
  };

  const handleStatusChange = e => {
    setTestStatus(e.target.value);
  };

  const handleEnvironmentChange = e => {
    setEnvironment(e.target.value);
  };

  const handleInputChange = field => e => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleClearField = field => {
    setFormData(prev => ({
      ...prev,
      [field]: '',
    }));
  };

  const handleToggleAttachment = () => {
    setFormData(prev => ({
      ...prev,
      hasAttachment: !prev.hasAttachment,
    }));
  };

  const handleClear = () => {
    setActivityType('manual');
    setTestStatus('');
    setEnvironment('');
    setFormData({
      observation: '',
      waiting: '',
      validation: '',
      information: '',
      blockReason: '',
      returnReason: '',
      evidenceDescription: '',
      evidenceLink: '',
      hasAttachment: false,
      testPlan: '',
      build: '',
      testCaseIds: '',
      pullRequest: '',
    });
  };

  const logFormData = useCallback(formData => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Test status form data:', formData);
    }
  }, []);

  return {
    activityType,
    testStatus,
    environment,
    formData,
    handleActivityTypeChange,
    handleStatusChange,
    handleEnvironmentChange,
    handleInputChange,
    handleClearField,
    handleToggleAttachment,
    handleClear,
    logFormData,
  };
};
