import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        contacts: {
            executor: 'ramping-arrival-rate',
            startRate: 1000,
            timeUnit: '1s',
            preAllocatedVUs: 30,
            stages: [
                { target: 10000, duration: '10s' },

                { target: 20000, duration: '10s' },

                { target: 30000, duration: '10s' },
            ],
        },
    },
};

const AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjgzMTMxMjEsImlzcyI6InRvZG9fYXV0aF9zZXJ2aWNlIiwic3ViIjoiMDE5YmIyNTQtMzdlNi03NWVhLWE3YjQtMmI4OTY5M2U1ZGM5In0.CtdgxlmnP2DTe686T-gwjpL3pD6ymKhNjwSYQeHPuiJnRyVcyRmA7xER5MSba9w1hFncM1bMxrHJOh1-I4mdAA';

export default function () {
    let headers = {
        'Cookie': `auth=${AUTH_TOKEN}`,
    };

    let res = http.get('http://localhost:8888/api/notes', { headers });

    check(res, { 'status was 200': (r) => r.status === 200 });
}