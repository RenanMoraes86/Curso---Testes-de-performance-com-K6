import http, { request } from 'k6/http';
import { check } from 'k6';
import { Counter, counter } from 'k6/metrics';
import { Gauge} from 'k6/metrics'
import { Rate } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import { group } from 'k6';
import { sleep } from 'k6';


export const options = {
     stages: [
        {duration: '2s', target: 1},
     ],
    thresholds: {
        checks: ['rate > 0.99'],
        http_req_duration: ['p(95) < 200']
    }
}


export default function() {
    const BASE_URL = 'https://quickpizza.grafana.com';
    
   
    

    const payload = JSON.stringify ({
       username: 'vascao',
       password: '1234'

    })

    const headers = {'Content-Type': 'application/json'};
    const requisicao = http.post(`https://quickpizza.grafana.com/api/users`, payload, { headers }) 
       

    check(requisicao, {
        'usuario criado': (r) => r.status === 201
    });

    sleep(1)
}


