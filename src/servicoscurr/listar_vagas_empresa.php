<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// Conexão
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

// Recebe id_empresa
$id_empresa = isset($_GET['id_empresa']) ? intval($_GET['id_empresa']) : 0;

if ($id_empresa <= 0) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID da empresa inválido.']);
    exit;
}

// Verificar se empresa existe
try {
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id AND funcao = 'empresa' LIMIT 1");
    $stmt->execute([':id' => $id_empresa]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['erro' => 'Empresa não encontrada ou inválida.']);
        exit;
    }
} catch (PDOException $e) {
    echo json_encode(['erro' => 'Erro ao validar empresa: ' . $e->getMessage()]);
    exit;
}

// Buscar vagas da empresa
try {
    $stmt = $pdo->prepare("
        SELECT 
            id,
            titulo,
            descricao,
            salario,
            modelo_trabalho,
            tipo_contrato,
            cidade,
            estado,
            DATE_FORMAT(data_criacao, '%d/%m/%Y %H:%i') AS data_criacao
        FROM vagas
        WHERE id_empresa = :id_empresa
        ORDER BY id DESC
    ");

    $stmt->execute([':id_empresa' => $id_empresa]);

    $vagas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'total' => count($vagas),
        'dados' => $vagas
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao buscar vagas: ' . $e->getMessage()]);
}
?>
