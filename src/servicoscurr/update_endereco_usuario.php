<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
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
    http_response_code(500);
    echo json_encode(['erro' => 'Falha na conexão: ' . $e->getMessage()]);
    exit;
}

// === RECEBE DADOS JSON ===
$dados = json_decode(file_get_contents("php://input"), true);

if (
    !$dados ||
    empty($dados['id_usuario']) ||
    empty($dados['tipo_residencia']) ||
    empty($dados['cidade']) ||
    empty($dados['estado']) ||
    empty($dados['bairro']) ||
    empty($dados['rua']) ||
    empty($dados['cep'])
) {
    http_response_code(400);
    echo json_encode(['erro' => 'Todos os campos obrigatórios devem ser preenchidos.']);
    exit;
}

// Sanitização
$id_usuario      = intval($dados['id_usuario']);
$tipo_residencia = trim($dados['tipo_residencia']);
$cidade          = trim($dados['cidade']);
$estado          = trim($dados['estado']);
$bairro          = trim($dados['bairro']);
$rua             = trim($dados['rua']);
$complemento     = !empty($dados['complemento']) ? trim($dados['complemento']) : null;
$cep             = trim($dados['cep']);

// === Validar tipo de residência ===
if (!in_array($tipo_residencia, ['Propria', 'Alugada', 'Outros'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Tipo de residência inválido.']);
    exit;
}

// === VERIFICAR SE O REGISTRO EXISTE ===
try {
    $stmt = $pdo->prepare("
        SELECT id_usuario
        FROM endereco_usuario
        WHERE id_usuario = :id
        LIMIT 1
    ");
    $stmt->execute([':id' => $id_usuario]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['erro' => 'Endereço não encontrado para este usuário.']);
        exit;
    }

    $id_registro = $stmt->fetchColumn();

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao verificar registro: ' . $e->getMessage()]);
    exit;
}

// === REALIZAR O UPDATE ===
$sql = "UPDATE endereco_usuario SET
            tipo_residencia = :tipo_residencia,
            cidade          = :cidade,
            estado          = :estado,
            bairro          = :bairro,
            rua             = :rua,
            complemento     = :complemento,
            cep             = :cep
        WHERE id_usuario = :id_usuario
        LIMIT 1";

try {
    $stmt = $pdo->prepare($sql);

    $ok = $stmt->execute([
        ':tipo_residencia' => $tipo_residencia,
        ':cidade'          => $cidade,
        ':estado'          => $estado,
        ':bairro'          => $bairro,
        ':rua'             => $rua,
        ':complemento'     => $complemento,
        ':cep'             => $cep,
        ':id_usuario'      => $id_usuario
    ]);

    if ($ok) {
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Endereço atualizado com sucesso!',
            'id_registro' => $id_registro
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['erro' => 'Falha ao atualizar o endereço.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao atualizar registro: ' . $e->getMessage()]);
}
?>
