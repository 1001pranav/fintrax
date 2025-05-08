"use client";
export const apiService = {
    get: async <T,>(url: string, params?: Record<string, unknown>): Promise<T> => {
        let urlWithParams = url;
        if (params && typeof params === "string") {
            const searchParams = new URLSearchParams(params);
            urlWithParams += `?${searchParams.toString()}`;
        }
        try {
            const response = await fetch(urlWithParams, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                // Improved error handling: Include status code in the error message.
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Check for empty response body
            const text = await response.text();
            if (!text) {
                return {} as T; // Or null, or throw an error, depending on your needs
            }
            return JSON.parse(text) as Promise<T>;

        } catch (error) {
            // Log the error for debugging purposes.  Important for troubleshooting!
            console.error("GET request failed:", error);
            // Re-throw the error to be handled by the caller.  This is crucial.
            throw error;
        }
    },
    post: async <T,>(url: string, data: unknown): Promise<T> => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {

                // Improved error handling: Include status code in the err
                return Promise.reject(response);
            }
            const text = await response.text();
            if (!text) {
                return {} as T;
            }
            return JSON.parse(text) as Promise<T>;
        } catch (error) {
            console.error("POST request failed:", error);
            throw error;
        }
    },
    put: async <T,>(url: string, data: unknown): Promise<T> => {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            if (!text) {
                return {} as T;
            }
            return JSON.parse(text) as Promise<T>;
        } catch (error) {
            console.error("PUT request failed:", error);
            throw error;
        }
    },
    patch: async <T,>(url: string, data: unknown): Promise<T> => {
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            if (!text) {
                return {} as T;
            }
            return JSON.parse(text) as Promise<T>;
        } catch (error) {
            console.error("PATCH request failed:", error);
            throw error;
        }
    },
    delete: async <T,>(url: string): Promise<T> => {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            if (!text) {
                return {} as T;
            }
            return JSON.parse(text) as Promise<T>;
        } catch (error) {
            console.error("DELETE request failed:", error);
            throw error;
        }
    },
};
