import axios from 'axios';
// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: false,
    timeout: 10000
});

// api.interceptors.request.use(
//     config => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     error => {
//         console.error('Request interceptor error:', error);
//         return Promise.reject(error);
//     }
// );

// api.interceptors.response.use(
//     response => response,
//     error => {
//         console.error('API response error:', error.message);
//         if (error.response && error.response.status === 401) {
//             localStorage.removeItem('token');
//             window.location.href = '/';
//         }
//         if (error.response && error.response.status === 500) {
//             console.error('Server error details:', error.response.data);
//         }

//         return Promise.reject(error);
//     }
// );

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const setAuthToken = (token) => {
    if (token) {
        console.log('Setting auth token:', token.substring(0, 20) + '...');
        localStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        console.log('Clearing auth token');
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
    }
};

const token = localStorage.getItem('token');

if (token) {
    setAuthToken(token);
}

export const login = async (credentials) => {
    try {
        const authRequest = {
            username: credentials.username,
            password: credentials.password,
            role: credentials.role
        };
        console.log('Sending authentication request:', authRequest);
        let response;
        // let response = {
        //     data: {
        //         data: {
        //             token: "dummy-token",
        //             userId: "user001"
        //         }
        //     }
        // };

        response = await api.post('/user/login', authRequest);
        console.log(".........response in api", response)
        if (response?.data && response.data?.data?.token) {
            const token = response.data.data.token || response.data.data.jwt;
            localStorage.setItem('token', token);
            if (response.data?.data?.userId) {
                localStorage.setItem('userId', response.data.data.userId);
            }

            const authResponse = {
                token: token,
                userId: response.data.data.userId || 'unknown',
            };
            console.log('Returning auth response:', authResponse);
            return authResponse;
        } else {
            return response;
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('Authentication failed with 401:', error.response.data);
            return {
                error: error.response.data.error || 'Incorrect username or password',
                message: error.response.data.error || 'Authentication failed. Please check your credentials.'
            };
        }
        console.error('Login error:', error);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        // Use direct API call for consistency
        const response = await api.post('/user/create', userData);
        console.log("........ signupresponse in api", response)
        // Handle successful response
        if (response.data && response.data.token) {
            // Store userId if it's returned in the response
            if (response.data.userId) {
                localStorage.setItem('userId', response.data.userId);
            }
        }
        return response.data;
    } catch (error) {
        console.error('Signup error:', error);
        return error;
    }
};

// Logout function
export const logout = () => {
    localStorage.removeItem("role"); // if you store role
    localStorage.removeItem("userId");
    setAuthToken(null);
    // Redirect to login page
    window.location.href = '/login';
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
};

// Get current user type
export const getUserType = () => {
    return localStorage.getItem('role') || 'LENDER';
};

// Get current user ID (if you store it)
export const getUserId = () => {
    return localStorage.getItem('userId');
};

// export const createEmployee = async (employeeData) => {
//     try {
//         const response = await api.post(`/employee/create`, employeeData);
//         return response.data;
//     } catch (error) {
//         console.error('Error while fetching user details:', error);
//         throw error;
//     }
// };

export const getRoleIdByCode = async (code) => {
    try {
        console.log("........code in api", code)
        const response = await api.get(`/reference-data/getByCode/${code}`, code);
        console.log("........ response in api role", response)
        return response.data;
    } catch (error) {
        console.log("...... error in role", error)
        console.error('Error while fetching user details:', error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        console.log("........code in api", productData)
        const response = await api.post(`/product/create`, productData);
        console.log("........ response in api role", response)
        return response.data;
    } catch (error) {
        console.log("...... error in role", error)
        console.error('Error while adding product details:', error);
        throw error;
    }
};







