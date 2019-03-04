<!DOCTYPE html>
<html lang="en">
  <style>
  body {
  font-family: "Lato", sans-serif;
  }

  .sidenav {
  height: 100%;
  width: 160px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #111;
  overflow-x: hidden;
  padding-top: 20px;
  }

  .sidenav a {
  padding: 6px 8px 6px 16px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  }

  .sidenav a:hover {
  color: #f1f1f1;
  }

  .main {
  margin-left: 160px; /* Same as the width of the sidenav */
  font-size: 28px; /* Increased text to enable scrolling */
  padding: 0px 10px;
  }

  @media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
  }
  </style>
  <head>
    <meta charset="utf-8">
    <title>Volcano Plot</title>
    <!-- Plotly.js -->
   <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
  </head>
  <body>
    <div class="sidenav">
      <select name="file" id="file" onChange="read_data()";>
        <option value="" selected="selected"></option>
        <?php
          $path = "./DGE_res";
          $dh = opendir($path);
          $i=1;
          while (($file = readdir($dh)) !== false) {
            if($file != "." && $file != ".." && $file != "index.php" && $file != ".htaccess" && $file != "error_log" && $file != "cgi-bin") {
              echo "<option value='$path/$file'>$file</option>";
              $i++;
            }
          }
          closedir($dh);
        ?>
      </select>
      <input name="foldchange" type="text" maxlength="512" id="foldchange" class="searchField" value="logfoldchange threshold"/>
      <input name="pvalue" type="text" maxlength="512" id="pvalue" class="searchField" value="pvalue threshold"/>
      <button onclick="create_plot()">Submit</button>
    </div>
    <div class="main" id="myDiv"><!-- Plotly chart will be drawn inside this DIV --></div>
    <script type="text/javascript" src="../d3.js"></script>
    <script type="text/javascript" src="./volcano.js"></script>
  </body>
</html>
