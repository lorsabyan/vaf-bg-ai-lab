import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import authService from '../../services/authService';

function LoginForm() {
  const { dispatch, ActionTypes } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: 'Էլ. փոստը և գաղտնաբառը պարտադիր են։'
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.signIn(formData.email, formData.password);
      
      if (result.success) {
        dispatch({
          type: ActionTypes.SET_AUTH,
          payload: result.data
        });
        dispatch({
          type: ActionTypes.SET_SUCCESS,
          payload: 'Հաջող մուտք։'
        });
      } else {
        dispatch({
          type: ActionTypes.SET_ERROR,
          payload: result.error
        });
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: 'Մուտքի ժամանակ տեղի ունեցավ սխալ։'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleKeyPress = (e, nextField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextField) {
        document.getElementById(nextField).focus();
      } else {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Բարի գալուստ</h2>
        <p className="text-gray-600">Brainograph AI Lab</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Էլեկտրոնային փոստ
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            onKeyPress={(e) => handleKeyPress(e, 'password')}
            placeholder="մուտքագրեք էլ. փոստը"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-gray-50 focus:bg-white"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Գաղտնաբառ
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            onKeyPress={(e) => handleKeyPress(e)}
            placeholder="մուտքագրեք գաղտնաբառը"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-gray-50 focus:bg-white"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:from-sky-300 disabled:to-sky-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Մուտք գործում...
            </div>
          ) : (
            'Մուտք գործել'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Powered by{' '}
          <span className="font-semibold text-sky-600">VAF</span>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
