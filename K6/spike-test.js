import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 }, 
        { duration: '30s', target: 500 },
        { duration: '1m', target: 100 },
        { duration: '2m', target: 0 },  
    ],
};

export default function () {
    http.get('https://just2play.gg/Device/MyDevices');
    sleep(1);
}
