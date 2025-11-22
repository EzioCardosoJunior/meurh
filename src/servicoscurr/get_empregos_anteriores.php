<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// === CONEXÃO COM O BANCO ===
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

// === VALIDAR ID DO USUÁRIO ===
if (!isset($_GET['id_usuario']) || empty($_GET['id_usuario'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID do usuário não informado.']);
    exit;
}

$id_usuario = intval($_GET['id_usuario']);

// === VERIFICAR SE USUÁRIO EXISTE ===
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $id_usuario]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['erro' => 'Usuário não encontrado.']);
    exit;
}

// === CONSULTAR EMPREGOS ANTERIORES ===
$sql = "SELECT *
        FROM empregos_anteriores
        WHERE id_usuario = :id_usuario
        ORDER BY data_entrada DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute([':id_usuario' => $id_usuario]);

$dados = $stmt->fetchAll(PDO::FETCH_ASSOC);

// === RETORNO PADRÃO ===
echo json_encode([
    'sucesso' => true,
    'qtd' => count($dados),
    'dados' => $dados
]);
?>
