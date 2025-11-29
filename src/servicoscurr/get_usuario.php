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

// === CONSULTA O USUÁRIO ===
try {
    $stmt = $pdo->prepare("
        SELECT 
            id,
            nome,
            nome_usuario,
            email,
            funcao,
            data_nascimento,
            cpf,
            cnpj,
            cnh,
            reservista,
            rg,
            pontos_preenchimento,
            status,
            data_criacao,
            ultimo_login
        FROM usuarios
        WHERE id = :id
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
