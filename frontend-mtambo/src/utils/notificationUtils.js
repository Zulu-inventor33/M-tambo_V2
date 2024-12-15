import { toast } from 'react-toastify';

/**
 * Display a success toast notification.
 * @param {string} message - The message to display in the toast.
 */
export const notifySuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

/**
 * Display an error toast notification.
 * @param {string} message - The message to display in the toast.
 */
export const notifyError = (message) => {
  toast.error(message, {
    position: "top-left",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

/**
 * Display a warning toast notification.
 * @param {string} message - The message to display in the toast.
 */
export const notifyWarning = (message) => {
  toast.warn(message, {
    position: "top-left",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

/**
 * Display an informational toast notification.
 * @param {string} message - The message to display in the toast.
 */
export const notifyInfo = (message) => {
  toast.info(message, {
    position: "top-left",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};