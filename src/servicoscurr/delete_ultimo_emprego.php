<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

$pdo = new PDO("mysql:host=mysql.tendapromos.com.br;dbname=tendapromos01;charset=utf8mb4","tendapro01_add1","060610Ejcj1");

$data = json_decode(file_get_contents("php://input"), true);

$id_usuario = intval($data['id_usuario']);

$stmt = $pdo->prepare("DELETE FROM ultimo_emprego WHERE id_usuario = :id");
$ok = $stmt->execute([':id' => $id_usuario]);

echo json_encode(['sucesso' => $ok]);
