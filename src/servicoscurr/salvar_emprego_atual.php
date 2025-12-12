<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

$host = 'mysql.tendapromos.com.br';
$dbname = 'tendapromos01';
$user = 'tendapro01_add1';
$pass = '060610Ejcj1';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha na conexão: ' . $e->getMessage()]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// Campos obrigatórios
if (!$data || 
    empty($data['id_usuario']) || 
    empty($data['empresa']) || 
    empty($data['funcao']) || 
    empty($data['data_entrada'])
) {
    http_response_code(400);
    echo json_encode(['erro' => 'Campos obrigatórios não preenchidos.']);
    exit;
}

$id_usuario    = intval($data['id_usuario']);
$empresa       = trim($data['empresa']);
$funcao        = trim($data['funcao']);
$data_entrada  = trim($data['data_entrada']);
$data_termino  = !empty($data['data_termino']) ? trim($data['data_termino']) : null;
$atual         = !empty($data['atual']) ? 1 : 0;
$atividades    = !empty($data['atividades']) ? trim($data['atividades']) : null;

// Novo campo
$salario_atual = isset($data['salario_atual']) && $data['salario_atual'] !== ''
                 ? floatval($data['salario_atual'])
                 : null;

// Se for emprego atual, não existe término
if ($atual == 1) {
    $data_termino = null;
}

$sql = "INSERT INTO emprego_atual
        (id_usuario, empresa, funcao, data_entrada, data_termino, atual, atividades, salario_atual)
        VALUES
        (:id_usuario, :empresa, :funcao, :data_entrada, :data_termino, :atual, :atividades, :salario_atual)";

$stmt = $pdo->prepare($sql);

$ok = $stmt->execute([
    ':id_usuario'     => $id_usuario,
    ':empresa'        => $empresa,
    ':funcao'         => $funcao,
    ':data_entrada'   => $data_entrada,
    ':data_termino'   => $data_termino,
    ':atual'          => $atual,
    ':atividades'     => $atividades,
    ':salario_atual'  => $salario_atual
]);

echo json_encode([
    'sucesso' => $ok,
    'mensagem' => $ok ? 'Registro salvo com sucesso.' : 'Falha ao salvar.'
]);
