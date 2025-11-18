<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// === CONEXÃO COM O BANCO ===
$host = 'mysql.tendappromos.com.br';
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

// === RECEBER JSON ===
$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados) {
    http_response_code(400);
    echo json_encode(['erro' => 'Nenhum dado recebido.']);
    exit;
}

// === VALIDAR CAMPOS OBRIGATÓRIOS ===
$required = [
    'id', 'id_usuario', 'instituicao_nome', 'cidade_estado',
    'curso_nome', 'nivel', 'data_inicio', 'data_fim', 'status'
];

foreach ($required as $campo) {
    if (!isset($dados[$campo]) || trim($dados[$campo]) === '') {
        http_response_code(400);
        echo json_encode(['erro' => "Campo obrigatório ausente: $campo"]);
        exit;
    }
}

// Sanitização
$id               = intval($dados['id']);
$id_usuario       = intval($dados['id_usuario']);
$instituicao_nome = trim($dados['instituicao_nome']);
$cidade_estado    = trim($dados['cidade_estado']);
$curso_nome       = trim($dados['curso_nome']);
$nivel            = trim($dados['nivel']);
$data_inicio      = trim($dados['data_inicio']);
$data_fim         = trim($dados['data_fim']);
$status           = trim($dados['status']);

// === VERIFICAR SE O USUÁRIO EXISTE ===
try {
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $id_usuario]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['erro' => 'Usuário não encontrado.']);
        exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao verificar usuário: ' . $e->getMessage()]);
    exit;
}

// === VERIFICAR SE O REGISTRO EXISTE ===
try {
    $stmt = $pdo->prepare("SELECT id FROM ensino_tecnico_graduacao WHERE id = :id AND id_usuario = :id_usuario LIMIT 1");
    $stmt->execute([':id' => $id, ':id_usuario' => $id_usuario]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['erro' => 'Registro não encontrado.']);
        exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao verificar registro: ' . $e->getMessage()]);
    exit;
}

// === ATUALIZAR REGISTRO ===
$sql = "UPDATE ensino_tecnico_graduacao SET
            instituicao_nome = :instituicao_nome,
            cidade_estado    = :cidade_estado,
            curso_nome       = :curso_nome,
            nivel            = :nivel,
            data_inicio      = :data_inicio,
            data_fim         = :data_fim,
            status           = :status
        WHERE id = :id AND id_usuario = :id_usuario";

try {
    $stmt = $pdo->prepare($sql);
    $ok = $stmt->execute([
        ':instituicao_nome' => $instituicao_nome,
        ':cidade_estado'    => $cidade_estado,
        ':curso_nome'       => $curso_nome,
        ':nivel'            => $nivel,
        ':data_inicio'      => $data_inicio,
        ':data_fim'         => $data_fim,
        ':status'           => $status,
        ':id'               => $id,
        ':id_usuario'       => $id_usuario
    ]);

    if ($ok) {
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Registro atualizado com sucesso!'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['erro' => 'Falha ao atualizar registro.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao atualizar registro: ' . $e->getMessage()]);
}
?>
