<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

$host = 'mysql.tendapromos.com.br';
$dbname = 'tendapromos01';
$user = 'tendapro01_add1';
$pass = '060610Ejcj1';

$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);

$id_usuario = isset($_GET['id_usuario']) ? intval($_GET['id_usuario']) : 0;

$stmt = $pdo->prepare("
    SELECT * FROM emprego_atual 
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
