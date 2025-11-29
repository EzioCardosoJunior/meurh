<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
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
    echo json_encode([
        "sucesso" => false,
        "erro" => "Falha na conexão: " . $e->getMessage()
    ]);
    exit;
}

// === RECEBE O ID DO USUÁRIO VIA GET ===
$id_usuario = isset($_GET['id_usuario']) ? intval($_GET['id_usuario']) : 0;

if ($id_usuario <= 0) {
    echo json_encode([
        "sucesso" => false,
        "erro" => "ID de usuário inválido."
    ]);
    exit;
}

// === CONSULTA O ENDEREÇO ===
try {
    $stmt = $pdo->prepare("
        SELECT * FROM endereco_usuario
        WHERE id_usuario = :id
        LIMIT 1
    ");
    $stmt->execute([':id' => $id_usuario]);

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        echo json_encode([
            "sucesso" => true,
            "dados" => $data
        ]);
    } else {
        echo json_encode([
            "sucesso" => false,
            "dados" => null
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "sucesso" => false,
        "erro" => "Erro na consulta: " . $e->getMessage()
    ]);
}
?>
