<?php
$conn = oci_connect('DEV_BPPRD', 'bpprD_Dev', 'localhost:1521/XE');
if ($conn)
{
    echo "Koneksi Oracle 11g berhasil!";
} else
{
    $e = oci_error();
    echo "Gagal: " . $e['message'];
}
?>