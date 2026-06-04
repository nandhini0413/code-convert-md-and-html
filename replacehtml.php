<DOCTYPE html
<html>
<body>
<h1>HTML to Markdown Heading</h1>
<form method="post">
Enter HTML program:
<br><br>
<textarea name="code"rows="25"cols="50"></textarea>
<br><br>
Enter HTML Heading:
<input type="text"name="html"placeholder="h1">
<br><br>
Enter Markdown symbol:
<input type="text"name="md"placeholder="#">
<br><br>
<input type="submit"name="search"value="Convert">
</form>
<?php
if(isset($_POST['search']))
{
$html=$_POST['html'];
$md=$_POST['md'];
$code=$_POST['code'];
$lines=explode("\n",$code);
foreach($lines as $line)
{
if(strpos($line,"<".$html.">")!==false)
{
$content=strip_tags($line);
echo $md." ".$content."<br>";
}
}
}
?>
</body>
</html>