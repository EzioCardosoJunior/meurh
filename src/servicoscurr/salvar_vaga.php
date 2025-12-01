<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

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

$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados) {
    http_response_code(400);
    echo json_encode(['erro' => 'Nenhum dado enviado.']);
    exit;
}

// Campos obrigatórios
$requeridos = ['id_empresa','titulo','descricao','modelo_trabalho','tipo_contrato','cidade','estado'];
foreach ($requeridos as $campo) {
    if (empty($dados[$campo])) {
        echo json_encode(['erro' => "Campo obrigatório ausente: $campo"]);
        exit;
    }
}

// Tratamento
$id_empresa       = intval($dados['id_empresa']);
$titulo           = trim($dados['titulo']);
$descricao        = trim($dados['descricao']);
$salario          = !empty($dados['salario']) ? $dados['salario'] : null;
$modelo_trabalho  = $dados['modelo_trabalho'];
$tipo_contrato    = $dados['tipo_contrato'];
$cidade           = trim($dados['cidade']);
$estado           = strtoupper(trim($dados['estado']));

// Verifica se empresa existe
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id AND funcao='empresa'");
$stmt->execute([':id' => $id_empresa]);

if ($stmt->rowCount() === 0) {
    echo json_encode(['erro' => 'Empresa não encontrada ou inválida.']);
    exit;
}

// Insert
$sql = "INSERT INTO vagas (
    id_empresa, titulo, descricao, salario, modelo_trabalho, tipo_contrato, cidade, estado
) VALUES (
    :id_empresa, :titulo, :descricao, :salario, :modelo_trabalho, :tipo_contrato, :cidade, :estado
)";

$stmt = $pdo->prepare($sql);
$ok = $stmt->execute([
    ':id_empresa'      => $id_empresa,
    ':titulo'          => $titulo,
    ':descricao'       => $descricao,
    ':salario'         => $salario,
    ':modelo_trabalho' => $modelo_trabalho,
    ':tipo_contrato'   => $tipo_contrato,
    ':cidade'          => $cidade,
    ':estado'          => $estado
]);

if ($ok) {
    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Vaga cadastrada com sucesso!',
        'id' => $pdo->lastInsertId()
    ]);
} else {
    echo json_encode(['erro' => 'Erro ao cadastrar a vaga.']);
}
