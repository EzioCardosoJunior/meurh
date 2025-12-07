<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// Conexão
$host = 'mysql.tendapromos.com.br';
$dbname = 'tendapromos01';
$user = 'tendapro01_add1';
$pass = '060610Ejcj1';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['erro' => 'Falha na conexão: ' . $e->getMessage()]);
    exit;
}

// Verifica id_usuario
$id_usuario = isset($_POST['id_usuario']) ? intval($_POST['id_usuario']) : 0;
if ($id_usuario <= 0) {
    echo json_encode(['erro' => 'ID do usuário inválido.']);
    exit;
}

// Verifica se usuário existe
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id LIMIT 1");
$stmt->execute([":id" => $id_usuario]);

if ($stmt->rowCount() === 0) {
    echo json_encode(['erro' => 'Usuário não encontrado.']);
    exit;
}

// Verifica se arquivo foi enviado
if (!isset($_FILES['foto'])) {
    echo json_encode(['erro' => 'Nenhuma foto enviada.']);
    exit;
}

$foto = $_FILES['foto'];

// Valida tamanho (máx. 1 MB)
if ($foto['size'] > 1024 * 1024) {
    echo json_encode(['erro' => 'A imagem deve ter no máximo 1MB.']);
    exit;
}

// Extensões permitidas
$permitidas = ['jpg', 'jpeg', 'png', 'webp'];
$ext = strtolower(pathinfo($foto['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $permitidas)) {
    echo json_encode(['erro' => 'Formato inválido. Envie JPG, PNG ou WEBP.']);
    exit;
}

// Criar pasta do usuário
$dir = "uploads/usuarios/$id_usuario/";
if (!is_dir($dir)) {
    mkdir($dir, 0777, true);
}

// Nome fixo do arquivo
$nomeArquivo = "foto_{$id_usuario}_fotoperfil.$ext";
$caminhoFinal = $dir . $nomeArquivo;

// Remover qualquer foto antiga do usuário (qualquer extensão)
foreach (glob($dir . "foto_{$id_usuario}_fotoperfil.*") as $arquivoAntigo) {
    if (file_exists($arquivoAntigo)) {
        unlink($arquivoAntigo);
    }
}

// Salvar arquivo
if (!move_uploaded_file($foto['tmp_name'], $caminhoFinal)) {
    echo json_encode(['erro' => 'Falha ao salvar arquivo.']);
    exit;
}

// Inserir ou atualizar no banco
$sql = "
    INSERT INTO usuario_fotos (id_usuario, foto)
    VALUES (:id_usuario, :foto)
    ON DUPLICATE KEY UPDATE foto = :foto, data_upload = NOW()
";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':id_usuario' => $id_usuario,
    ':foto'       => $caminhoFinal
]);

echo json_encode([
    'sucesso' => true,
    'mensagem' => 'Foto enviada com sucesso!',
    'foto_url' => $caminhoFinal
]);
?>
