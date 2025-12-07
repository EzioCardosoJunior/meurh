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

// Verifica id_usuario
$id_usuario = isset($_GET['id_usuario']) ? intval($_GET['id_usuario']) : 0;

if ($id_usuario <= 0) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID do usuário inválido.']);
    exit;
}

// Verifica se o usuário existe
try {
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id LIMIT 1");
    $stmt->execute([":id" => $id_usuario]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['erro' => 'Usuário não encontrado.']);
        exit;
    }
} catch (PDOException $e) {
    echo json_encode(['erro' => 'Erro ao validar usuário: ' . $e->getMessage()]);
    exit;
}

// Buscar foto do usuário
try {
    $stmt = $pdo->prepare("
        SELECT * 
        FROM usuario_fotos 
        WHERE id_usuario = :id_usuario
        LIMIT 1
    ");
    $stmt->execute([':id_usuario' => $id_usuario]);

    if ($stmt->rowCount() === 0) {
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Nenhuma foto encontrada.',
            'foto' => null
        ]);
        exit;
    }

    $foto = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Foto encontrada.',
        'foto' => $foto['foto'],
        'data_upload' => $foto['data_upload']
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao buscar foto: ' . $e->getMessage()]);
}
?>
