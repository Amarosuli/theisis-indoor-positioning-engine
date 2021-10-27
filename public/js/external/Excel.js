export const excel = {
    set(table, name) {
        this.table = document.getElementById(table)
        this.name = name
        this.uri = 'data:application/vnd.ms-excel;base64,'
        this.template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <!--[if gte mso 9]>
                    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                        <x:ExcelWorkbook>
                            <x:ExcelWorksheet>
                                <x:Name>{worksheet}</x:Name>
                                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorkbook>
                    </xml>
                <![endif]-->
            </head>
        <body>
        <table>{table}</table>
        </body>
        </html>`
        this.base64 = (s) => {
            return window.btoa(unescape(encodeURIComponent(s)))}
        this.format = (s, c) => {
            return s.replace(/{(\w+)}/g, function(m, p) { return c[p]})}
    },
    export() {
        if (!this.table.nodeType) table = this.table
        var ctx = {
            worksheet: this.name || 'Worksheet',
            table: this.table.innerHTML
        }
        window.location.href = this.uri + this.base64(this.format(this.template, ctx))
    }
}