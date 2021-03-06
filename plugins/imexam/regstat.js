/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9 */ 

"use strict";


(function() {
    var imexam = require("./imexam");


    var statTemplate = "                                                                                \
        <table width=100% style='padding-right: 6px; padding-left: 0px'>                                \
            <tr><td align=right>position x</td> <td align=right>{reg.x%.2f}              </td>          \
            <td align=right>y</td>              <td align=right>{reg.y%.2f}             </td></tr>      \
            <tr><td align=right>box width</td>      <td align=right>{reg.width%.2f}         </td>       \
            <td align=right>height</td>         <td align=right>{reg.height%.2f}        </td></tr>      \
            <tr><td align=right>min</td>        <td align=right>{min%.2f}               </td>           \
            <td align=right>max</td>            <td align=right>{max%.2f}               </td></tr>      \
            <tr><td align=right>totcounts</td>     <td align=right colspan=3>{centroid2.sum%.2f}</tr>   \
            <tr><td align=right>bscounts</td>     <td align=right colspan=3>{centroid.sum%.2f}</tr>     \
            <tr><td align=right>bkgd</td>     <td align=right>{backgr.value%.2f}      </td>             \
            <td align=right>noise</td>          <td align=right>{backgr.noise%.2f}      </td></tr>      \
            <tr><td align=right>centroid x</td> <td align=right>{centroid.cenx%.2f}     </td>           \
            <td align=right>y</td>              <td align=right>{centroid.ceny%.2f}     </td></tr>      \
            <tr><td align=right>FWHM</td>       <td align=right>{centroid.fwhm%.2f}     </td>           \
            <td align=right></td>            <td align=right>{centroid.rms%.2f}      </td></tr>         \
        </table>";

    function statUpdate(im, xreg) {
        var div = this.div;

            var section = imexam.reg2section(xreg);
	    var imag    = imexam.getRegionData(im, xreg);

            var data    = imexam.ndops.assign(imexam.ndops.zeros(imag.shape), imag);
            var data2   = imexam.ndops.assign(imexam.ndops.zeros(imag.shape), imag);

            var stat    = {};

            stat.reg = xreg;
            stat.min = imexam.ndops.minvalue(imag);
            stat.max = imexam.ndops.maxvalue(imag);
            stat.backgr  = imexam.imops.backgr(imag, 4);

            imexam.ndops.subs(data, imag, stat.backgr.value);

            stat.qcenter  = imexam.ndops.qcenter(data);
            stat.centroid = imexam.ndops.centroid(data, imexam.ndops.qcenter(data));
            stat.centroid2 = imexam.ndops.centroid(data2, imexam.ndops.qcenter(data2));

            stat.centroid.cenx += section[0][0];
            stat.centroid.ceny += section[1][0];

            $(div).html(imexam.template(statTemplate, stat));
    }

    function statInit() {
	imexam.fixupDiv(this);
        $(this.div).append("<p style='padding: 20px 0px 0px 20px; margin: 0px'>create, click, move, or resize a region to see stats<br>");
    }

    JS9.RegisterPlugin("ImExam", "RegionStats", statInit, {
	    menu: "analysis",

            winTitle: "Region Stats",
            menuItem: "Region Stats",
	    help:     "imexam/imexam.html#rgstat",

	    toolbarSeparate: true,

            onregionschange: statUpdate,
            winDims: [250, 250],
    });
}());
