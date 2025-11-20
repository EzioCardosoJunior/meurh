<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$host = 'mysql.tendapromos.com.br';
$dbname = 'tendapromos01';
$user = 'tendapro01_add1';
$pass = '060610Ejcj1';

// Corrigido: variáveis corretas
$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "mensagem" => "Erro na conexão com o banco: " . $conn->connect_error
    ]);
    exit();
}

// Verifica se o ID foi recebido
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode([
        "status" => "error",
        "mensagem" => "ID do trabalho temporário não informado."
    ]);
    exit();
}

$id = intval($_GET['id']);

$stmt = $conn->prepare("DELETE FROM trabalhos_temp WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "status" => "success",
            "mensagem" => "Registro deletado com sucesso."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "mensagem" => "Nenhum registro encontrado com este ID."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "mensagem" => "Erro ao deletar: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
