# VAF Brainograph AI Lab - Test Checklist

## Pre-Testing Setup

- [ ] Application is running on `http://localhost:3000/vaf-bg-ai-lab`
- [ ] Have a valid Gemini API key ready for testing
- [ ] Browser has JavaScript enabled
- [ ] Test on both desktop and mobile devices

## 1. Authentication Testing

- [ ] **Login Form Displays**: Homepage shows the login form
- [ ] **Successful Login**: Can log in with valid credentials
- [ ] **Session Persistence**: Refresh page maintains logged-in state
- [ ] **Logout Functionality**: Logout button works and redirects to login

## 2. Navigation & UI Testing

- [ ] **Header Navigation**: Three tabs visible (Որոնում, Վիկտորինա, Պատմություն)
- [ ] **Tab Switching**: Can switch between all three tabs
- [ ] **Mobile Navigation**: Sidebar collapses/expands on mobile
- [ ] **Responsive Design**: Layout adapts properly to different screen sizes
- [ ] **API Key Modal**: 🔑 button opens API key configuration modal

## 3. Article Explorer Testing

- [ ] **Search Interface**: Search panel loads in sidebar when on "Որոնում" tab
- [ ] **Article Search**: Can search for articles (mock search functionality)
- [ ] **Article Selection**: Can select and view articles
- [ ] **Article Display**: Articles display properly in the main content area
- [ ] **Text Selection**: Can select text for explanations (requires API key)

## 4. API Key Management

- [ ] **API Key Input**: Can enter Gemini API key via 🔑 button
- [ ] **Key Persistence**: API key saves and persists across sessions
- [ ] **Key Validation**: App validates API key format
- [ ] **Error Handling**: Shows appropriate error for invalid keys

## 5. Quiz Generation Testing

- [ ] **Quiz Tab Access**: "Վիկտորինա" tab loads quiz generator
- [ ] **Article Required**: Shows error if no article selected
- [ ] **API Key Required**: Shows error if no API key configured
- [ ] **Instructions Input**: Can customize quiz generation instructions
- [ ] **Model Selection**: Can choose different Gemini models
- [ ] **Temperature Control**: Slider adjusts creativity parameter
- [ ] **Generate Quiz**: "Ստեղծել վիկտորինա" button generates quiz
- [ ] **Quiz Display**: Generated quiz shows in sidebar with question count

## 6. Quiz Taking Testing

- [ ] **Start Quiz**: "Սկսել վիկտորինան" button opens quiz interface
- [ ] **Question Display**: Questions display clearly with multiple choice options
- [ ] **Answer Selection**: Can select answers by clicking options
- [ ] **Progress Bar**: Progress indicator shows completion percentage
- [ ] **Navigation**: Previous/Next buttons work correctly
- [ ] **Answer Validation**: Cannot proceed without selecting an answer
- [ ] **Quiz Completion**: Finish quiz shows results modal

## 7. Quiz Results Testing

- [ ] **Score Display**: Shows percentage score prominently
- [ ] **Performance Feedback**: Shows appropriate message based on score
- [ ] **Detailed Results**: Shows correct/incorrect for each question
- [ ] **Answer Review**: Can see user answers vs correct answers
- [ ] **Save Results**: Results automatically save to history
- [ ] **Close Modal**: Can close results and return to main interface

## 8. Quiz History Testing

- [ ] **History Tab**: "Պատմություն" tab loads quiz history
- [ ] **Empty State**: Shows appropriate message when no history exists
- [ ] **Quiz List**: Displays completed quizzes with scores and dates
- [ ] **Statistics**: Shows overall statistics (total, average, best scores)
- [ ] **View Details**: Can view detailed results for individual quizzes
- [ ] **Delete Quiz**: Can delete individual quiz results
- [ ] **Clear History**: Can clear all quiz history
- [ ] **Data Persistence**: History persists across browser sessions

## 9. Error Handling Testing

- [ ] **Network Errors**: Handles API failures gracefully
- [ ] **Invalid API Key**: Shows clear error for authentication failures
- [ ] **Malformed Responses**: Handles unexpected API responses
- [ ] **Loading States**: Shows appropriate loading indicators
- [ ] **User Messages**: Success/error messages display correctly
- [ ] **Timeout Handling**: Handles slow API responses appropriately

## 10. Performance Testing

- [ ] **Initial Load**: App loads within reasonable time
- [ ] **Navigation Speed**: Tab switching is responsive
- [ ] **Quiz Generation**: AI responses complete within acceptable time
- [ ] **Smooth Interactions**: UI interactions feel responsive
- [ ] **Memory Usage**: No obvious memory leaks during extended use

## 11. Accessibility Testing

- [ ] **Keyboard Navigation**: Can navigate using keyboard only
- [ ] **Screen Reader**: Important content is accessible to screen readers
- [ ] **Color Contrast**: Text has sufficient contrast ratios
- [ ] **Focus Indicators**: Interactive elements show focus clearly
- [ ] **Alt Text**: Images have appropriate alternative text

## 12. Mobile Testing

- [ ] **Touch Navigation**: All buttons/links work with touch
- [ ] **Responsive Layout**: Content fits properly on small screens
- [ ] **Mobile Sidebar**: Sidebar overlay works correctly
- [ ] **Virtual Keyboard**: Form inputs work with mobile keyboards
- [ ] **Orientation Changes**: Layout adapts to portrait/landscape

## 13. Data Integrity Testing

- [ ] **LocalStorage**: Data saves/loads correctly from browser storage
- [ ] **State Management**: App state remains consistent during use
- [ ] **Quiz Data**: Generated quizzes maintain proper structure
- [ ] **User Preferences**: Settings persist between sessions

## 14. Integration Testing

- [ ] **Gemini AI Integration**: Successfully generates quizzes using AI
- [ ] **Article Integration**: Quizzes properly reference article content
- [ ] **Cross-Component Communication**: Components share data correctly
- [ ] **Event Handling**: User interactions trigger appropriate responses

## Bug Report Template

If you find any issues during testing, please report them using this format:

**Bug Title**: Brief description of the issue
**Steps to Reproduce**:

1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**: What should happen
**Actual Behavior**: What actually happens
**Browser**: Chrome/Firefox/Safari version
**Device**: Desktop/Mobile/Tablet
**Screenshot**: If applicable

## Test Results Summary

After completing all tests, summarize results:

- **Total Tests**: ___/84 passed
- **Critical Issues**: ___
- **Minor Issues**: ___

**Recommendations**:

-
-
-

**Overall Assessment**:
□ Ready for deployment
□ Needs minor fixes
□ Needs major fixes
□ Not ready for deployment

**Tested By**: _______________
**Date**: ___________________
