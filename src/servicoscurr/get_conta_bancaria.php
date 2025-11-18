
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// === CONFIGURAÇÃO DE BANCO ===
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

// === VERIFICA SE RECEBEU id_usuario ===
if (!isset($_GET['id_usuario']) || empty($_GET['id_usuario'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Parâmetro id_usuario é obrigatório.']);
    exit;
}

$id_usuario = intval($_GET['id_usuario']);

try {
    // Consulta única por usuário (1 conta por usuário)
    $stmt = $pdo->prepare("
        SELECT 
            id,
            id_usuario,
            titular_nome,
            titular_sobrenome,
            banco,
            agencia,
            conta,
            criado_em,
            atualizado_em
        FROM contas_bancarias
        WHERE id_usuario = :id_usuario
        LIMIT 1
    ");

    $stmt->execute([':id_usuario' => $id_usuario]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['erro' => 'Nenhuma conta bancária encontrada para este usuário.']);
        exit;
    }

    $conta = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'conta' => $conta
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao buscar conta bancária: ' . $e->getMessage()]);
}
?>
