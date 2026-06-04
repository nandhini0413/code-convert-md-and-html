<!DOCTYPE html>
<html>
<body>
<h2>Search Markdown heading</h2>
<form method="post">
Paste MD program:
<br>
<textarea name="code"rows="25"cols="50"></textarea>
<br>
Enter Symbol:
<input type="text"name="tag"placeholder="#">
<br><br>
Replace symbol:
<input type="text"name="tag"placeholder="h1">
<br><br>
<input type="submit"name="search"value="Convert">
</form>
<?php
if(isset($_POST['convert']))
{
$md=$_POST['search'];
$html=$_POST['html'];
$code=$_POST['code'];
$lines=explode("\n",$code);
foreach($lines as $line)
{
if(strops($line,$md." ")===0)
{
$content=substr($line,strlen($md)+1);
echo htmlspecialchars("<".$html.">".$content."</".$html.">");
}
}
}
?>
</body>
</html>

