<?php

declare(strict_types=1);

// Main
$protocol = isset($_SERVER['HTTPS']) ? 'https' : 'http';

$url = "$protocol://{$_SERVER['SERVER_NAME']}";

header('Content-Type: application/opensearchdescription+xml');

echo '<?xml version="1.0" encoding="utf-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
	<ShortName>Akkorokamui</ShortName>
	<Description>Search Hackernews threads through Akkorokamui</Description>
	<InputEncoding>UTF-8</InputEncoding>
	<LongName>Akkorokamui, a modern and lightweight Hackernews frontend</LongName>
	<Url type="text/html" template="' . $url . '/s/{searchTerms}"/>
</OpenSearchDescription>';
