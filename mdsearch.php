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
input type="submit"name="search"value="Search">
</form>
<?php
if(isset($_POST['search']))
{
$tag=$_POST['tag'];
$code=$_POST['code'];
$lines=explode("\n",$code);
$found=false;
foreach($lines as $line)
{
if(strpos($line,$tag." ")==0)
{
$content=substr($line,strlen($tag)+1);
echo"<br>Content:".$content;
$found=true;
}
}
if($found==false)
{
echo"<br>Heading not found";
}
}
?>
</body>
</html>