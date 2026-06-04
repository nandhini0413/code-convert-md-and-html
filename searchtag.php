<!DOCTYPE html>
<html>
<body>
<h2>Search html</h2>
<p>Html search</p>
<form method="post">
paste program:
<br>
<textarea name="code"rows="25"cols="50"></textarea><br>
enter tags:
<input type="text"name="tag"placeholder="Example:h1">
<br><br>
<input type="submit"name="search"value="Search">
</form>
<?php
if(isset($_POST['search']))
{
$tag=$_POST['tag'];
$code=$_POST['code'];
if(preg_match("/<$tag>(.*?)<\/$tag>/",$code,$m))
{
echo"<br>".$m[1];
}
else
{
echo"<br>Tag not found";
}
}
?>
</body>
</html>