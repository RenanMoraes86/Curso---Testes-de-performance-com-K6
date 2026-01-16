// Inicialização
import http, { request } from 'k6/http';
import { check } from 'k6';
import { Counter, counter } from 'k6/metrics';
import { Gauge} from 'k6/metrics'
import { Rate } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import { group } from 'k6';



// Configuração
export const options = {
    vus: 1,
    duration: '30s',
    thresholds: {
        http_req_failed: ['rate < 0.01'],
        http_req_duration: [{threshold: 'p(95) < 200', abortOnFail: true, delayAbortEval: '10s'}],
        checks: ['rate > 0.99']
    }
}


// contador
const chamadas = new Counter('quantidade_de_chamadas');

// medidor
const myGauge = new Gauge('tempo_bloqueado');

// taxa
const myRate = new Rate('taxa_de_req_com_sucesso');

// tendencia
const myTrend = new Trend('taxa_de_espera');



// Execupção // Código vu

export default function() { 
  group('teste', function(){ 
    const res = http.get('https://blazedemo.com/index.php');

    // contador
    chamadas.add(1);

    // medidor
    myGauge.add(res.timings.blocked);

    // taxa
    myRate.add(res.status === 200);

    // tendencia
    myTrend.add(res.timings.waiting);

    check(res, {
        'status code é 200': (r) => r.status === 201
    })
 })


 
}




// Desmontagem