import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import the useLoader hook
import { useLoader } from '../../context/LoaderContext';
import { notifySuccess, notifyError } from '../../utils/notificationUtils';

const useForm = () => {
    const { startLoading, stopLoading } = useLoader();
    const [loading, setLoading] = useState(false);
    const [maintenanceCompanies, setMaintenanceCompanies] = useState([]);
    const [errors, setErrors] = useState({});
    const [errorMessages, setErrorMessages] = useState([]);
    const [step, setStep] = useState(1);
    // A shake animation to show an error
    const [isShaking, setIsShaking] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confirmPassword: '',
        accountType: '',
        developerName: '',
        developerAddress: '',
        specialization: '',
        companyName: '',
        companyAddress: '',
        companyRegNumber: '',
        equipmentSpecialization: '',
        affiliatedCompany: '',
        maintenance_company_id: '',
    });

    //update the formData whenever a registered input changes.
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // validate the data the we are inputing
    const validateForm = () => {
        let errors = {};
        let valid = true;

        if (!formData.email) {
            errors.email = 'Email is required';
            valid = false;
        }
        if (!formData.firstName) {
            errors.firstName = 'First name is required';
            valid = false;
        }
        if (!formData.lastName) {
            errors.lastName = 'Last name is required';
            valid = false;
        }
        if (!formData.phone) {
            errors.phone = 'Phone number is required';
            valid = false;
        }
        if (!formData.password) {
            errors.password = 'Password is required';
            valid = false;
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    //Before going to the next step ensure that previous step is complete
    const isStepComplete = () => {
        const errors = [];
        if (step === 1) {
            // Check if any required field is empty or if passwords do not match
            if (
                formData.email === '' || formData.firstName === '' ||
                formData.lastName === '' || formData.phone === '' ||
                formData.password === '' || formData.confirmPassword === '' ||
                formData.password !== formData.confirmPassword
            ) {
                errors.push("Please fill out all fields.");
            }

            // Validate email format if email is not empty
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (formData.email && !emailRegex.test(formData.email)) {
                errors.push("Enter a valid email address.");
            }
        }
        else if (step === 2) {
            if (formData.phone === '' || formData.password === '' || formData.confirmPassword === '' || formData.password !== formData.confirmPassword) {
                errors.push("Please fill out all fields and make sure passwords match.");
            }
        } else if (step === 3) {
            if (formData.accountType === '') {
                errors.push("Please select an account type.");
            }
        } else if (step === 4) {
            if (formData.accountType === 'developer' && (formData.developerName === '' || formData.developerAddress === '')) {
                errors.push("Please fill out all fields for Developer.");
            } else if (formData.accountType === 'maintenance' && (formData.companyName === '' || formData.companyAddress === '')) {
                errors.push("Please fill out all fields for Maintenance.");
            } else if (formData.accountType === 'technician' && (formData.equipmentSpecialization === '' || formData.affiliatedCompany === '')) {
                errors.push("Please fill out all fields for Technician.");
            }
        }

        // If there are errors, update the state and return false
        if (errors.length > 0) {
            setErrorMessages(errors);
            setIsShaking(true);
            // Reset the shaking animation after 1 second
            setTimeout(() => setIsShaking(false), 1000);
            return false;
        }

        // Clear errors if step is complete
        setErrorMessages([]);
        return true;
    };

    // Navigate to the next step if the current step is complete
    const handleNextStep = () => {
        if (isStepComplete()) {
            setStep(step + 1);
        }
    };

    // Navigate to the previous step
    const handlePrevStep = () => {
        setErrorMessages([]);
        if (step > 1) {
            setStep(step - 1);
        }
    };


    // Handle radio button selection
    const handleSpecializationChange = async (event) => {
        const selectedSpecialization = event.target.value;
        console.log(selectedSpecialization);
        setFormData((prevData) => ({
            ...prevData,
            equipmentSpecialization: selectedSpecialization,
        }));
        // Call the function to fetch maintenance companies based on selection
        try {
            setLoading(true);
            startLoading();
            const response = await axios.get(`/api/maintenance-companies/${selectedSpecialization}`);
            setMaintenanceCompanies(response.data);
        } catch (error) {
            console.error('Error fetching maintenance companies:', error);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const userData = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone_number: formData.phone,
                password: formData.password,
                account_type: formData.accountType,
            };

            if (formData.accountType === 'developer') {
                userData.developer_name = formData.developerName;
                userData.address = formData.developerAddress;
            } else if (formData.accountType === 'maintenance') {
                userData.company_name = formData.companyName;
                userData.company_address = formData.companyAddress;
                userData.company_registration_number = formData.companyRegNumber;
                userData.specialization = formData.specialization;
            } else if (formData.accountType === 'technician') {
                userData.maintenance_company_id = formData.maintenance_company_id;
                userData.specialization = formData.equipmentSpecialization;
            }

            console.log("Data to be sent to Mtambo Api", userData)
            try {
                const response = await axios.post('/api/signup/', JSON.stringify(userData), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                // the response that I get from server api is user details if reg is successfull contains
                console.log(response.status)
                if (response?.status === 201) {
                    console.log('User registered successfully', response);
                    setLoading(false);

                    // Start showing the loader for a brief moment before navigating
                    startLoading();
                    // Set a timeout to stop the loader after 1.5 seconds
                    setTimeout(() => {
                        stopLoading();
                    }, 1500);
                    // Redirect to login page
                    navigate('/login');
                }
                return;
            } catch (error) {
                setLoading(false);
                console.log('Error response:', error.response?.data);
                // If there are validation errors from the API, handle them
                if (error.response?.data?.phone_number) {
                    notifyError('Phone number is already taken');
                    setIsShaking(true);  // Trigger shake animation on error
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        phone_number: 'Phone number is already taken',
                    }));
                } else if (error.response?.data?.email) {
                    notifyError('Email already taken');
                    setIsShaking(true);  // Trigger shake animation on error
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: 'A user with this email already exists.',
                    }));
                } else {
                    // Handle any other errors that might occur
                    setIsShaking(true);  // Trigger shake animation on generic error
                }
            }
        } else {
            setLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        handleInputChange,
        handleNextStep,
        handlePrevStep,
        handleSpecializationChange,
        validateForm,
        handleSubmit,
        isStepComplete,
        errors,
        errorMessages,
        step,
        setStep,
        maintenanceCompanies,
        loading,
        isShaking,
        setFormData
    };
};

export default useForm;