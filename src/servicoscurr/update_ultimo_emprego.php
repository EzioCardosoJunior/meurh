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
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha na conexão: ' . $e->getMessage()]);
    exit;
}

// ===============================
// LER PAYLOAD
// ===============================
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['id']) || empty($data['empresa']) || empty($data['funcao']) || empty($data['data_entrada'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Campos obrigatórios não preenchidos.']);
    exit;
}

$id            = intval($data['id']);
$empresa       = trim($data['empresa']);
$funcao        = trim($data['funcao']);
$data_entrada  = trim($data['data_entrada']);
$data_termino  = !empty($data['data_termino']) ? trim($data['data_termino']) : null;
$atual         = !empty($data['atual']) ? 1 : 0;
$atividades    = !empty($data['atividades']) ? trim($data['atividades']) : null;

// NOVO CAMPO
$salario_atual = isset($data['salario_atual']) && $data['salario_atual'] !== ''
                 ? floatval($data['salario_atual'])
                 : null;

// Se for emprego atual, zera data de término
if ($atual == 1) {
    $data_termino = null;
}

// ===============================
// UPDATE COM SALARIO_ATUAL
// ===============================
$sql = "UPDATE emprego_atual SET
            empresa        = :empresa,
            funcao         = :funcao,
            data_entrada   = :data_entrada,
            data_termino   = :data_termino,
            atual          = :atual,
            atividades     = :atividades,
            salario_atual  = :salario_atual
        WHERE id = :id";

$stmt = $pdo->prepare($sql);

// Executar
$ok = $stmt->execute([
    ':empresa'        => $empresa,
    ':funcao'         => $funcao,
    ':data_entrada'   => $data_entrada,
    ':data_termino'   => $data_termino,
    ':atual'          => $atual,
    ':atividades'     => $atividades,
    ':salario_atual'  => $salario_atual,
    ':id'             => $id
]);

echo json_encode([
    'sucesso'  => $ok,
    'mensagem' => $ok ? 'Registro atualizado com sucesso.' : 'Falha ao atualizar.'
]);
