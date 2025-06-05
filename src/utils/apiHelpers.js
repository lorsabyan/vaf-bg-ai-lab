/**
 * Utility functions for API-related operations
 */

/**
 * Validates if Gemini API key is available and dispatches error if not
 * @param {Object} state - App state containing API keys
 * @param {Function} dispatch - Redux dispatch function
 * @param {Object} ActionTypes - Redux action types
 * @param {Function} t - Translation function
 * @returns {boolean} - Returns true if API key is valid, false otherwise
 */
export const validateGeminiApiKey = (state, dispatch, ActionTypes, t) => {
  if (!state.apiKeys.gemini) {
    dispatch({
      type: ActionTypes.SET_ERROR,
      payload: t('articleViewer.errors.apiKeyRequired')
    });
    return false;
  }
  return true;
};
