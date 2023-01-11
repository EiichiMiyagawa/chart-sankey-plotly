import "https://cdn.plot.ly/plotly-2.15.1.min.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

class ChartSankey extends HTMLElement {
  constructor(data, options) {
    super();
    
    if (data !== undefined) {
      this.setData(dataList, options);
    } else {
      const src = this.getAttribute("src");
      if (src) {
        this.fetchCsv(src, options);
        return;
      }
      
      const txt = this.textContent.trim().split("\n").map((t) => {
        return t.trim();
      }).join("\n");
      const json = CSV.toJSON(CSV.decode(txt));
      this.textContent = "";
      this.setData(json, options);
    }
  }
  
  async fetchCsv(src, options) {
    const json = CSV.toJSON(await CSV.fetch(src));
    this.setData(json, options);
  }
  
  setData(data, options = {}) {
    const labelIndex = {};
    data.forEach((d) => {
      labelIndex[d["name1"]] = null;
      labelIndex[d["name2"]] = null;
    });
    
    const label = Object.keys(labelIndex);
    label.forEach((l, index) => {
      labelIndex[l] = index;
    });

    const source = [];
    const target = [];
    const value = [];
    data.forEach((d) => {
      source.push(labelIndex[d["name1"]]);
      target.push(labelIndex[d["name2"]]);
      value.push(d["count"]);
    });
    
    const sankeyData = {
      type: "sankey",
      orientation: "h",
      node: {
        pad: 50,
        thickness: 30,
        line: {
          color: "black",
          width: 1
        },
        label: label
      },
      
      link: {
        source: source,
        target: target,
        value:  value
      }
    };
    
    const layout = {
      title: options["title"],
      font: {
        size: 16
      }
    };
    if (!this.style.width) {
      layout.width = !options["width"] ? 800 : options["width"];
    }
    if (!this.style.height) {
      layout.height = !options["height"] ? 600 : options["height"];
    }
    
    Plotly.react(this, [sankeyData], layout);
  }
}

customElements.define("chart-sankey", ChartSankey);

export { ChartSankey };
