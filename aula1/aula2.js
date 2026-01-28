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
    stages: [
        {duration:'1m', target: 100},
        {duration:'10s', target:1000},
        {duration:'1m', target:1000},
        {duration:'1m', target: 0},
    ],
    
    thresholds: {
        http_req_failed: ['rate < 0.01'],
        
        
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
    const res = http.get('https://quickpizza.grafana.com');

    // contador
    chamadas.add(1);

    // medidor
    myGauge.add(res.timings.blocked);

    // taxa
    myRate.add(res.status === 200);

    // tendencia
    myTrend.add(res.timings.waiting);

    check(res, {
        'status code é 200': (r) => r.status === 200
    })
 })


 
}




// Desmontagem