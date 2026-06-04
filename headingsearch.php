<!DOCTYPE html>
<html>
<body>
<h1>Php program</h1>
<h2>html program</h2>
<h3>java program</h3>
<h4>python program</h4>
<h5>c program</h5>
<h6>c++ program</h6>
<form method="POST">
search Heading:
<input type="text"name="txt">
<input type="submit"name="search"value="Search">
</form>
<?php
if(isset($_POST['search']))
{
$a=$_POST['txt'];
if($a=="h1")
{
echo "Php program found";
}
elseif($a=="h2")
{
echo "Php program found";
}
elseif($a=="h3")
{
echo "Php program found";
}
elseif($a=="h4")
{
echo "Php program found";
}
elseif($a=="h5")
{
echo "Php program found";
}
elseif($a=="h6")
{
echo "Php program found";
}
else
{
echo"php not found";
}
}
?>
</body>
</html>