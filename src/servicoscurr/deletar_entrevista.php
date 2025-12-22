<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// === CONEXÃO ===
$host = 'mysql.tendapromos.com.br';
$dbname = 'tendapromos01';
$user = 'tendapro01_add1';
$pass = '060610Ejcj1';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha na conexão']);
    exit;
}

// === RECEBE JSON ===
$dados = json_decode(file_get_contents("php://input"), true);

// === VALIDAR CAMPOS ===
$id_candidatura    = intval($dados['id_candidatura'] ?? 0);
$id_vaga           = intval($dados['id_vaga'] ?? 0);
$id_usuario_editor = intval($dados['id_usuario_editor'] ?? 0);

if ($id_candidatura <= 0 || $id_vaga <= 0 || $id_usuario_editor <= 0) {
    http_response_code(400);
    echo json_encode(['erro' => 'Dados obrigatórios inválidos']);
    exit;
}

try {

    // === TRANSAÇÃO ===
    $pdo->beginTransaction();

    // === DELETA ENTREVISTA ===
    $sqlDelete = "
        DELETE FROM entrevistas
        WHERE id_candidatura = :id_candidatura
          AND id_vaga = :id_vaga
    ";

    $stmt1 = $pdo->prepare($sqlDelete);
    $stmt1->execute([
        ':id_candidatura' => $id_candidatura,
        ':id_vaga' => $id_vaga
    ]);

    // === ATUALIZA candidaturas_vagas ===
    $sqlCandidatura = "
        UPDATE candidaturas_vagas
        SET
            agendado = 'NÃO',
            data_entrevista = NULL
        WHERE id = :id_candidatura
    ";

    $stmt2 = $pdo->prepare($sqlCandidatura);
    $stmt2->execute([
        ':id_candidatura' => $id_candidatura
    ]);

    // === COMMIT ===
    $pdo->commit();

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Entrevista removida com sucesso'
    ]);

} catch (PDOException $e) {

    // === ROLLBACK ===
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'erro' => 'Falha ao remover entrevista',
        'detalhe' => $e->getMessage()
    ]);
}
?>
