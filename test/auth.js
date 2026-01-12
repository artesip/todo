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
export default function () {

    let res = http.post('http://127.0.0.1:9999/auth/logout');

    check(res, { 'status was 200': (r) => r.status === 204 });
}