<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// CONEXÃO
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

$dados = json_decode(file_get_contents("php://input"), true);

// VALIDAR CAMPOS OBRIGATÓRIOS
$id_candidatura     = intval($dados['id_candidatura'] ?? 0);
$id_vaga            = intval($dados['id_vaga'] ?? 0);
$id_usuario_editor  = intval($dados['id_usuario_editor'] ?? 0);
$agendado           = $dados['agendado'] ?? 'A REVISAR';

if ($id_candidatura <= 0 || $id_vaga <= 0 || $id_usuario_editor <= 0) {
    http_response_code(400);
    echo json_encode(['erro' => 'Dados obrigatórios inválidos']);
    exit;
}

// DEMAIS CAMPOS
$data_entrevista        = !empty($dados['data_entrevista']) ? $dados['data_entrevista'] : null;
$entrevistador_nome     = $dados['entrevistador_nome'] ?? null;
$entrevista_concluida   = $dados['entrevista_concluida'] ?? 'NÃO';
$hard_skills            = intval($dados['hard_skills'] ?? 0);
$soft_skills            = intval($dados['soft_skills'] ?? 0);
$alinhamento_cultural   = intval($dados['alinhamento_cultural'] ?? 0);
$observacoes            = $dados['observacoes'] ?? null;

try {

    // === INICIA TRANSAÇÃO ===
    $pdo->beginTransaction();

    // === UPSERT ENTREVISTA ===
    $sqlEntrevista = "
        INSERT INTO entrevistas (
            id_candidatura,
            id_vaga,
            id_usuario_editor,
            agendado,
            data_entrevista,
            entrevistador_nome,
            entrevista_concluida,
            hard_skills,
            soft_skills,
            alinhamento_cultural,
            observacoes
        ) VALUES (
            :id_candidatura,
            :id_vaga,
            :id_usuario_editor,
            :agendado,
            :data_entrevista,
            :entrevistador_nome,
            :entrevista_concluida,
            :hard_skills,
            :soft_skills,
            :alinhamento_cultural,
            :observacoes
        )
        ON DUPLICATE KEY UPDATE
            agendado = VALUES(agendado),
            data_entrevista = VALUES(data_entrevista),
            entrevistador_nome = VALUES(entrevistador_nome),
            entrevista_concluida = VALUES(entrevista_concluida),
            hard_skills = VALUES(hard_skills),
            soft_skills = VALUES(soft_skills),
            alinhamento_cultural = VALUES(alinhamento_cultural),
            observacoes = VALUES(observacoes),
            id_usuario_editor = VALUES(id_usuario_editor)
    ";

    $stmt1 = $pdo->prepare($sqlEntrevista);
    $stmt1->execute([
        ':id_candidatura' => $id_candidatura,
        ':id_vaga' => $id_vaga,
        ':id_usuario_editor' => $id_usuario_editor,
        ':agendado' => $agendado,
        ':data_entrevista' => $data_entrevista,
        ':entrevistador_nome' => $entrevistador_nome,
        ':entrevista_concluida' => $entrevista_concluida,
        ':hard_skills' => $hard_skills,
        ':soft_skills' => $soft_skills,
        ':alinhamento_cultural' => $alinhamento_cultural,
        ':observacoes' => $observacoes
    ]);

    // === ATUALIZA candidaturas_vagas ===
    $sqlCandidatura = "
    UPDATE candidaturas_vagas
    SET
        agendado = :agendado,
        data_entrevista = :data_entrevista
    WHERE id = :id_candidatura
";


    $stmt2 = $pdo->prepare($sqlCandidatura);
    $stmt2->execute([
    ':agendado' => $agendado,
    ':data_entrevista' => $data_entrevista,
    ':id_candidatura' => $id_candidatura
]);

    // === COMMIT ===
    $pdo->commit();

    echo json_encode(['sucesso' => true]);

} catch (PDOException $e) {

    // === ROLLBACK ===
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'erro' => 'Falha ao salvar entrevista',
        'detalhe' => $e->getMessage()
    ]);
}
