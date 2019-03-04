var dataset;
// console.log(document.getElementById("foldchange").value);
// console.log(document.getElementById("pvalue").value);
function create_plot(foldchange,pvalue) {
  read_data(function() {
    console.log('huzzah, I\'m done!');
  });
  data = dataset.filter(function(d){
    if(isNaN(d.padj)){
        return false;
    }
    return true;
  });
  function log10(val) {
    return Math.log(val) / Math.LN10;
  }
  var name = [],
  log2FoldChange = [],
  log_padj = [],
  sig_log2FoldChange = [],
  sig_log_padj = [];
  data.map(function(d) {
    name.push(d.name);
    if(d.padj <= parseFloat(document.getElementById("pvalue").value) && Math.abs(d.log2FoldChange) > parseFloat(document.getElementById("foldchange").value) ){
      sig_log2FoldChange.push(d.log2FoldChange);
      sig_log_padj.push(log10(d.padj)*-1);
    } else {
      log2FoldChange.push(d.log2FoldChange);
      log_padj.push(log10(d.padj)*-1);
    }
  })
  function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }
  var max = getMaxOfArray(sig_log_padj)
  // console.log(max)
  var trace1 = {
    x: log2FoldChange,
    y: log_padj,
    mode: 'markers',
    name: 'unsig',
    marker: {
      color: 'rgba(0, 0, 0, 0.95)',
      line: {
        color: 'rgba(0, 0, 0, 1.0)',
        width: 1,
      },
      symbol: 'circle',
      size: 1
    }
  };
  var trace2 = {
    x: sig_log2FoldChange,
    y: sig_log_padj,
    mode: 'markers',
    name: 'sig',
    marker: {
      color: 'rgba(0, 0, 0, 0.95)',
      line: {
        color: 'rgba(200, 0, 0, 1.0)',
        width: 1,
      },
      symbol: 'circle',
      size: 1
    }
  };

  var data = [trace1, trace2];
  // console.log(data);

  var layout = {
    title: {
      text: "Volcano plot",
      font: {
        family: 'Times New Roman',
        size: 25,
        color: 'rgba(0, 0, 0, 1.0)'
      }
    },
    yaxis: {
      showline: true,
      showgrid: false,
      title: {
        text: 'negative log10 p_adj',
        font: {
          family: 'Times New Roman',
          size: 18,
          color: 'rgba(0, 0, 0, 1.0)'
        }
      },
    },
    xaxis: {
      showline: false,
      showgrid: false,
      title: {
        text: 'log2FoldChange',
        font: {
          family: 'Times New Roman',
          size: 18,
          color: 'rgba(0, 0, 0, 1.0)'
        }
      }
    },
    margin: {
      l: 140,
      r: 40,
      b: 50,
      t: 80
    },
    legend: {
      font: {
        size: 10,
      },
      yanchor: 'middle',
      xanchor: 'right'
    },
    width: 600,
    height: 600,
    shapes: [
      {
        type: 'line',
        x0: parseFloat(document.getElementById("foldchange").value),
        y0: 0,
        x1: parseFloat(document.getElementById("foldchange").value),
        y1: max,
        line: {
          color: 'rgb(55, 128, 191)',
          width: 2
        }
      },
      {
        type: 'line',
        x0: -1*parseFloat(document.getElementById("foldchange").value),
        y0: 0,
        x1: -1*parseFloat(document.getElementById("foldchange").value),
        y1: max,
        line: {
          color: 'rgb(55, 128, 191)',
          width: 2
        }
      }
    ]
  };

  Plotly.newPlot('myDiv', data, layout, {displayModeBar: false});
}
function read_data(_callback) {
  var e = document.getElementById("file");
  var strUser = e.options[e.selectedIndex].value;
  d3.csv(strUser).then(function(data){
      dataset = data;
  });
  _callback();
}
