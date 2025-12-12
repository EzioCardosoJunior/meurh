<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

$host = 'mysql.tendapromos.com.br';
$dbname = 'tendapromos01';
$user = 'tendapro01_add1';
$pass = '060610Ejcj1';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    echo json_encode(['erro' => 'Falha na conexão: ' . $e->getMessage()]);
    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);

$id_candidatura = $dados['id_candidatura'] ?? 0;
$agendado = $dados['agendado'] ?? '';

$validos = ['SIM', 'NÃO', 'A REVISAR'];

if ($id_candidatura <= 0 || !in_array($agendado, $validos)) {
    echo json_encode(['erro' => 'Dados inválidos.']);
    exit;
}

$sql = "UPDATE candidaturas_vagas SET agendado = :agendado WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':agendado' => $agendado,
    ':id' => $id_candidatura
]);

echo json_encode(['sucesso' => true, 'mensagem' => 'Status atualizado']);
?>
