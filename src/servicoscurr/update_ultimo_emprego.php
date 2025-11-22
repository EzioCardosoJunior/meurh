<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

$host = 'mysql.tendapromos.com.br';
$dbname = 'tendapromos01';
$user = 'tendapro01_add1';
$pass = '060610Ejcj1';

$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);

$data = json_decode(file_get_contents("php://input"), true);

$id = intval($data['id']);
$empresa = $data['empresa'];
$funcao = $data['funcao'];
$data_entrada = $data['data_entrada'];
$data_termino = !empty($data['data_termino']) ? $data['data_termino'] : null;
$atual = $data['atual'] ? 1 : 0;
$atividades = $data['atividades'];

if ($atual == 1) {
    $data_termino = null;
}

$sql = "UPDATE ultimo_emprego SET
        empresa = :empresa,
        funcao = :funcao,
        data_entrada = :data_entrada,
        data_termino = :data_termino,
        atual = :atual,
        atividades = :atividades
        WHERE id = :id";

$stmt = $pdo->prepare($sql);

$ok = $stmt->execute([
    ':empresa' => $empresa,
    ':funcao' => $funcao,
    ':data_entrada' => $data_entrada,
    ':data_termino' => $data_termino,
    ':atual' => $atual,
    ':atividades' => $atividades,
    ':id' => $id
]);

echo json_encode(['sucesso' => $ok]);
