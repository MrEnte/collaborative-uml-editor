import { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export enum HTTP_METHOD {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}
export const BASE_API_URL = 'http://localhost:8000/api/';

export const AUTH_TOKEN_IDENTIFIER = 'authToken';
export const REFRESH_TOKEN_IDENTIFIER = 'refreshToken';

type FetchFromBackendParameters<SuccessData, FailureData> = {
    url: string;
    onSuccess?: (data: SuccessData) => void;
    onFailure?: (data: FailureData) => void;
    onError?: (error: Error) => void;
    method?: HTTP_METHOD;
    body?: BodyInit;
};

type UseFetchReturn<SuccessData = unknown, FailureData = unknown> = {
    data?: SuccessData;
    failureData?: FailureData;
    loading: boolean;
    error: string | undefined;
    triggerRefetch: () => void;
};

export const fetchFromBackend = <SuccessData = unknown, FailureData = unknown>({
    url,
    onSuccess,
    onFailure,
    onError,
    method = HTTP_METHOD.GET,
    body,
}: FetchFromBackendParameters<SuccessData, FailureData>): void => {
    const cookies = new Cookies();

    fetch(`${BASE_API_URL}${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookies.get<string>(
                AUTH_TOKEN_IDENTIFIER
            )}`,
        },
        body,
    })
        .then((res) => {
            res.json()
                .then((json: SuccessData | FailureData) => {
                    if (res.status < 400) {
                        onSuccess?.(json as SuccessData);
                    } else {
                        onFailure?.(json as FailureData);
                    }
                })
                .catch((error: Error) => onError?.(error));
        })
        .catch((error: Error) => {
            onError?.(error);
        });
};

export const useFetch = <SuccessData = unknown, FailureData = unknown>(
    url?: string,
    method: HTTP_METHOD = HTTP_METHOD.GET,
    body?: BodyInit
): UseFetchReturn<SuccessData, FailureData> => {
    const [data, setData] = useState<SuccessData>();
    const [loading, setLoading] = useState(!!url);
    const [failureData, setFailureData] = useState<FailureData>();
    const [error, setError] = useState<string>();
    const [rerenderValue, setRerenderValue] = useState(Symbol());
    const triggerRefetch = () => setRerenderValue(Symbol());

    const navigate = useNavigate();

    useEffect(() => {
        if (!url) {
            return;
        }

        setLoading(true);
        setError(undefined);
        setData(undefined);
        setFailureData(undefined);
        fetchFromBackend<SuccessData, FailureData>({
            url,
            onSuccess: (json) => {
                setData(json);

                setLoading(false);
            },
            onError: (err) => {
                setError(err.message);

                setLoading(false);
            },
            onFailure: (json) => {
                setFailureData(json);
                setLoading(false);

                navigate('/');
            },
            method,
            body,
        });
    }, [url, method, body, rerenderValue]);

    return {
        data,
        failureData,
        loading,
        error,
        triggerRefetch,
    };
};
