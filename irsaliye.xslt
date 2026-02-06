<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ccts="urn:un:unece:uncefact:documentation:2" xmlns:clm54217="urn:un:unece:uncefact:codelist:specification:54217:2001" xmlns:clm5639="urn:un:unece:uncefact:codelist:specification:5639:1988" xmlns:clm66411="urn:un:unece:uncefact:codelist:specification:66411:2001" xmlns:clmIANAMIMEMediaType="urn:un:unece:uncefact:codelist:specification:IANAMIMEMediaType:2003" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:link="http://www.xbrl.org/2003/linkbase" xmlns:n1="urn:oasis:names:specification:ubl:schema:xsd:DespatchAdvice-2" xmlns:qdt="urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2" xmlns:udt="urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2" xmlns:xbrldi="http://xbrl.org/2006/xbrldi" xmlns:xbrli="http://www.xbrl.org/2003/instance" xmlns:xdt="http://www.w3.org/2005/xpath-datatypes" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" exclude-result-prefixes="cac cbc ccts clm54217 clm5639 clm66411 clmIANAMIMEMediaType fn link n1 qdt udt xbrldi xbrli xdt xlink xs xsd xsi">
  <xsl:character-map name="a">
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
    <xsl:output-character character="" string="" />
  </xsl:character-map>
  <xsl:decimal-format name="european" decimal-separator="," grouping-separator="." NaN="" />
  <xsl:output version="4.0" method="html" indent="no" encoding="UTF-8" doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN" doctype-system="http://www.w3.org/TR/html4/loose.dtd" use-character-maps="a" />
  <xsl:param name="SV_OutputFormat" select="'HTML'" />
  <xsl:variable name="XML" select="/" />
  <xsl:param name="param_logo" />
  <xsl:variable name="var_logo" />
  <xsl:variable name="var_qr" />
  <xsl:template match="/">
    <html>
      <head>
        <style type="text/css">
                    body {
                        background-color: #FFFFFF;
                        font-family: 'Tahoma', "Times New Roman", Times, serif;
                        font-size: 11px;
                        color: #666666;
                    }
                    h1, h2 {
                        padding-bottom: 3px;
                        padding-top: 3px;
                        margin-bottom: 5px;
                        text-transform: uppercase;
                        font-family: Arial, Helvetica, sans-serif;
                    }
                    h1 {
                        font-size: 1.4em;
                        text-transform:none;
                    }
                    h2 {
                        font-size: 1em;
                        color: brown;
                    }
                    h3 {
                        font-size: 1em;
                        color: #333333;
                        text-align: justify;
                        margin: 0;
                        padding: 0;
                    }
                    h4 {
                        font-size: 1.1em;
                        font-style: bold;
                        font-family: Arial, Helvetica, sans-serif;
                        color: #000000;
                        margin: 0;
                        padding: 0;
                    }
                    hr {
                        height:2px;
                        color: #000000;
                        background-color: #000000;
                        border-bottom: 1px solid #000000;
                    }
                    p, ul, ol {
                        margin-top: 1.5em;
                    }
                    ul, ol {
                        margin-left: 3em;
                    }
                    blockquote {
                        margin-left: 3em;
                        margin-right: 3em;
                        font-style: italic;
                    }
                    a {
                        text-decoration: none;
                        color: #70A300;
                    }
                    a:hover {
                        border: none;
                        color: #70A300;
                    }
                    #despatchTable {
                        border-collapse:collapse;
                        font-size:11px;
                        float:right;
                        border-color:gray;
                    }
                    #ettnTable {
                        border-collapse:collapse;
                        font-size:11px;
                        border-color:gray;
                    }
                    #customerPartyTable {
                        border-width: 0px;
                        border-spacing:;
                        border-style: inset;
                        border-color: gray;
                        border-collapse: collapse;
                        background-color:
                    }
                    #customerIDTable {
                        border-width: 2px;
                        border-spacing:;
                        border-style: inset;
                        border-color: gray;
                        border-collapse: collapse;
                        background-color:
                    }
                    #customerIDTableTd {
                        border-width: 2px;
                        border-spacing:;
                        border-style: inset;
                        border-color: gray;
                        border-collapse: collapse;
                        background-color:
                    }
                    #lineTable {
                        border-width:2px;
                        border-spacing:;
                        border-style: inset;
                        border-color: black;
                        border-collapse: collapse;
                        background-color:;
                    }
                    td.lineTableTd {
                        border-width: 1px;
                        padding: 1px;
                        border-style: inset;
                        border-color: black;
                        background-color: white;
                    }
                    tr.lineTableTr {
                        border-width: 1px;
                        padding: 0px;
                        border-style: inset;
                        border-color: black;
                        background-color: white;
                        -moz-border-radius:;
                    }
                    #lineTableDummyTd {
                        border-width: 1px;
                        border-color:white;
                        padding: 1px;
                        border-style: inset;
                        border-color: black;
                        background-color: white;
                    }
                    td.lineTableBudgetTd {
                        border-width: 2px;
                        border-spacing:0px;
                        padding: 1px;
                        border-style: inset;
                        border-color: black;
                        background-color: white;
                        -moz-border-radius:;
                    }
                    #notesTable {
                        border-width: 2px;
                        border-spacing:;
                        border-style: inset;
                        border-color: black;
                        border-collapse: collapse;
                        background-color:
                    }
                    #notesTableTd {
                        border-width: 0px;
                        border-spacing:;
                        border-style: inset;
                        border-color: black;
                        border-collapse: collapse;
                        background-color: ;
                        vertical-align: top;
                    }
                    table {
                        border-spacing:0px;
                    }
                    #budgetContainerTable {
                        border-width: 0px;
                        border-spacing: 0px;
                        border-style: inset;
                        border-color: black;
                        border-collapse: collapse;
                        background-color:;
                    }
                    td {
                        border-color:gray;
                    }</style>
        <title>e-İrsaliye</title>
      </head>
      <body style="margin-left=0.6in; margin-right=0.6in; margin-top=0.79in; margin-bottom=0.79in">
        <xsl:for-each select="$XML">
          <table style="border-color:blue; " border="0" cellspacing="0px" width="800" cellpadding="0px">
            <tbody>
              <tr valign="top">
                <td width="40%">
                  <br />
                  <hr />
                  <table align="center" border="0" width="100%">
                    <tbody>
                      <tr align="left">
                        <xsl:for-each select="n1:DespatchAdvice/cac:DespatchSupplierParty/cac:Party">
                          <td align="left">
                            <xsl:if test="cac:PartyName">
                              <xsl:value-of select="cac:PartyName/cbc:Name" />
                              <br />
                            </xsl:if>
                          </td>
                        </xsl:for-each>
                      </tr>
                      <tr align="left">
                        <xsl:for-each select="n1:DespatchAdvice/cac:DespatchSupplierParty/cac:Party">
                          <td align="left">
                            <xsl:for-each select="cac:PostalAddress">
                              <xsl:for-each select="cbc:District">
                                <xsl:apply-templates />
                                <xsl:text>
                                </xsl:text>
                              </xsl:for-each>
                              <xsl:for-each select="cbc:StreetName">
                                <xsl:apply-templates />
                                <xsl:text>
                                </xsl:text>
                              </xsl:for-each>
                              <xsl:for-each select="cbc:BuildingName">
                                <xsl:apply-templates />
                              </xsl:for-each>
                              <xsl:if test="cbc:BuildingNumber">
                                <xsl:text> No:</xsl:text>
                                <xsl:for-each select="cbc:BuildingNumber">
                                  <xsl:apply-templates />
                                </xsl:for-each>
                                <xsl:text>
                                </xsl:text>
                              </xsl:if>
                              <xsl:for-each select="cbc:Room">
                                <xsl:text>Kapı No:</xsl:text>
                                <xsl:apply-templates />
                                <xsl:text>
                                </xsl:text>
                              </xsl:for-each>
                              <br />
                              <xsl:for-each select="cbc:PostalZone">
                                <xsl:apply-templates />
                                <xsl:text>
                                </xsl:text>
                              </xsl:for-each>
                              <xsl:for-each select="cbc:CitySubdivisionName">
                                <xsl:apply-templates />
                              </xsl:for-each>
                              <xsl:text>/ </xsl:text>
                              <xsl:for-each select="cbc:CityName">
                                <xsl:apply-templates />
                                <xsl:text>
                                </xsl:text>
                              </xsl:for-each>
                            </xsl:for-each>
                          </td>
                        </xsl:for-each>
                      </tr>
                      <xsl:if test="//n1:DespatchAdvice/cac:DespatchSupplierParty/cac:Party/cac:Contact/cbc:Telephone or //n1:DespatchAdvice/cac:DespatchSupplierParty/cac:Party/cac:Contact/cbc:Telefax">
                        <tr align="left">
                          <xsl:for-each select="n1:DespatchAdvice/cac:DespatchSupplierParty/cac:Party">
                            <td align="left">
                              <xsl:for-each select="cac:Contact">
                                <xsl:if test="cbc:Telephone">
                                  <xsl:text>Tel: </xsl:text>
                                  <xsl:for-each select="cbc:Telephone">
                                    <xsl:apply-templates />
                                  </xsl:for-each>
                                </xsl:if>
                                <xsl:if test="cbc:Telefax">
                                  <xsl:text> Fax: </xsl:text>
                                  <xsl:for-each select="cbc:Telefax">
                                    <xsl:apply-templates />
                                  </xsl:for-each>
                                </xsl:if>
                                <xsl:text>
                                </xsl:text>
                              </xsl:for-each>
                            </td>
                          </xsl:for-each>
                        </tr>
                      </xsl:if>
                      <xsl:for-each select="//n1:DespatchAdvice/cac:DespatchSupplierParty/cac:Party/cbc:WebsiteURI">
                        <tr align="left">
                          <td>
                            <xsl:text>Web Sitesi: </xsl:text>
                            <xsl:value-of select="." />
                          </td>
                        </tr>
                      </xsl:for-each>
                      <xsl:for-each select="//n1:DespatchAdvice/cac:DespatchSupplierParty/cac:Party/cac:Contact/cbc:ElectronicMail">
                        <tr align="left">
                          <td>
                            <xsl:text>E-Posta: </xsl:text>
                            <xsl:value-of select="." />
                          </td>
                        </tr>
                      </xsl:for-each>
                      <tr align="left">
                        <xsl:for-each select="n1:DespatchAdvice/cac:DespatchSupplierParty/cac:Party">
                          <td align="left">
                            <xsl:text>Vergi Dairesi: </xsl:text>
                            <xsl:for-each select="cac:PartyTaxScheme">
                              <xsl:for-each select="cac:TaxScheme">
                                <xsl:for-each select="cbc:Name">
                                  <xsl:apply-templates />
                                </xsl:for-each>
                              </xsl:for-each>
                              <xsl:text>
                              </xsl:text>
                            </xsl:for-each>
                          </td>
                        </xsl:for-each>
                      </tr>
                      <xsl:for-each select="//n1:DespatchAdvice/cac:DespatchSupplierParty/cac:Party/cac:PartyIdentification">
                        <tr align="left">
                          <td>
                            <xsl:value-of select="cbc:ID/@schemeID" />
                            <xsl:text>: </xsl:text>
                            <xsl:value-of select="cbc:ID" />
                          </td>
                        </tr>
                      </xsl:for-each>
                      <tr align="left">
                        <xsl:for-each select="n1:DespatchAdvice/cac:DespatchSupplierParty/cac:Party/cac:PhysicalLocation">
                          <td align="left">
                            <b>
                              <xsl:for-each select="cbc:ID">
                                <xsl:apply-templates />
                                <xsl:text>:</xsl:text>
                              </xsl:for-each>
                            </b>
                            <br />
                            <xsl:for-each select="cac:Address">
                              <xsl:for-each select="cbc:StreetName">
                                <xsl:apply-templates />
                                <xsl:text>
                                </xsl:text>
                              </xsl:for-each>
                              <xsl:for-each select="cbc:BuildingName">
                                <xsl:apply-templates />
                              </xsl:for-each>
                              <xsl:if test="cbc:BuildingNumber">
                                <xsl:text> No:</xsl:text>
                                <xsl:for-each select="cbc:BuildingNumber">
                                  <xsl:apply-templates />
                                </xsl:for-each>
                                <xsl:for-each select="cbc:Room">
                                  <xsl:apply-templates />
                                </xsl:for-each>
                                <xsl:text>
                                </xsl:text>
                              </xsl:if>
                              <br />
                              <xsl:for-each select="cbc:PostalZone">
                                <xsl:apply-templates />
                                <xsl:text>
                                </xsl:text>
                              </xsl:for-each>
                              <xsl:for-each select="cbc:CitySubdivisionName">
                                <xsl:apply-templates />
                              </xsl:for-each>
                              <xsl:text>/ </xsl:text>
                              <xsl:for-each select="cbc:CityName">
                                <xsl:apply-templates />
                                <xsl:text>  /</xsl:text>
                              </xsl:for-each>
                              <xsl:for-each select="cac:Country/cbc:Name">
                                <xsl:apply-templates />
                                <xsl:text>
                                </xsl:text>
                              </xsl:for-each>
                            </xsl:for-each>
                          </td>
                        </xsl:for-each>
                      </tr>
                    </tbody>
                  </table>
                  <hr />
                </td>
                <td width="20%" align="center" valign="middle">
                  <br />
                  <br />
                  <img style="width:91px;" align="middle" alt="E-Fatura Logo" src="data:image/jpeg;base64,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" />
                  <h1 align="center">
                    <span style="font-weight:bold; ">
                      <xsl:text>e-İRSALİYE</xsl:text>
                    </span>
                  </h1>
                </td>
               <td width="15%" align="right" valign="bottom">
                  <div id="qrcode">
                     <img src="{$QRSOVOS}" alt="qrcode" width="175px" />
                     <xsl:text>
                     </xsl:text>
                      <img style="width:220px; height:120px;" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCADQA+gDASIAAhEBAxEB/8QAHgABAAICAwEBAQAAAAAAAAAAAAgJBgcEBQoDAgH/xABZEAAABQMDAQQGBQgECAwEBwAAAQIDBAUGBwgREiEJEyIxFDJBQlJiFSNRYXEkM0NTcoGCkRZzg6IXGDRjkqGxsyVEVFh0k5ajssHD0xlkwtE1RVd1hMXU/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ALUwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEStSXaT4J0y5FexfdNEumu12JHZkS00ViM41E71PNDbinX0HzNBpXx29VaftElb9vOhY7suuX5c0juKVb9PfqUxzbqlppBrPb7+nQeabK+Rq7l7Jdy5NuVfKpXLUn6g8klcia5q3S2k/gQnigvlQQC/fS3rXw5q3TVmMbtV6DUqIht6bT6xCQ06hpwzShZKaWttRbp+Lf7hIIVldiPZMeJj/JOR1o5PVKsQ6Ggz91EZk3lbfj6Wnf9gWagAAAAMbu/I2PcfxkzL+vu3rajq6k9WKoxDQr+J1SSGSDzma3b4i5E1W5MuWmzn5cEq8/BiuOvG6RtRvqfAZmf1Zm2pSS+EwHoati7bUvekM3BZdzUqv0p/wDNTqXNblR3NvhcaM0n/MdyIAdjBbtQpemi469NbW2zWrvkuReXquNNRo7ZrL+0JxP8An+AAAAAAAAAAAAAAAAAAAAAANKamdV+JtJ9qwrpyhJnSHqpJ9Fp9KpLbb0+WZdVrQ244hPBBess1JLqlPrKSkaext2sWkTINVYo8ytXDZz8pwmWnLjpyGWDUflydYcdbbL5lmkgEzAH5SpK0kpJ7kfkY/QAAAAAAAADE8k5Is7EljVrId9VdFOodBjKlS3lH4ti8kILzWtR7JSgvWUfERixz2rukPIFWjUaVcNetJ+W4TbS7ipiWWeR+XJ1lx1tv9pakpATJAfhKkrSSkq5JV1IyH7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEadUevPBullhdJr9TXcF3m33ke26WslPp39U5Dh+GMjr7/i4+qhQCSwjhnHtANLWBTk0+5cisVquReSVUa3yKfLJZe4s0qJplX3OOIFRGo7tENRuopcmly7mValrO8klQaC6thtxs9/DId37x/p5kZ938iRF0BZxlHtsrxmuyImGcQUulskrZqdcUtcp1aft9HZNtKFf2ixG27O011qXZIcdVmJ2kML8o1JpkWMhv8Fk2bn81jXuJdIWpLOLbcvGuJK7UoD2ykVF9pMSEpJ+1Mh80Nr/hMxK2yexWzvWGvSL5yTZ9ucuqWYpP1B1P7XhbR/JagETp+sLVfUXe9kakslIP/wCXueYwXX7m3EkJkdmhrmzdWM6UfB+VL2ql4UG6232YcirOqkzIEttlbyVlIUZuLQtLakGlZq80qLj4uWStdhtLUjd7U20lftJNnGov5+mkNzaWeyotjTplilZcrOXpt2VGhKdcp8VqjJp7CXXGVtGtzd51S9icVtsaeoCeoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjrqf1y4T0mSqRScjqrdTq9ZSp1ml0KOzIlMx09O/dJ11pKEGrwl4uSuuyfCo0hIoBFHCfaW6WM33HAs+j3JVrertVeTHgU+4IHo5yXlKIkNpdbW4zzUZ8SSbniPyErgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHzccbZbU46tKW0luZn0JJEArx7YzPS7OxDRcHUWYTdSvmT6XU0pPxJpkZZHxPY+neP8Ad7fKy6QppG+NbOdj1E6kbtv+JL76isv/AEVQuvhTT45qS2pP9YfePftOmNDgL2+yTt1mh6MKBU2meKrgrNUqTiviUmQcXf8AlGSX7hM0aG0J0Fu29H+Jqc01wS9bMWocfmk7yDP95ujfIAAAA0Drgz8xpx053RfMaahquzWfoegI3LkqovpUTa0kfn3aSceP7mjHnabbflPpaaQp111WyUl1UpRic/ay6kG8t5zRii3J5O25jfvIbqm1kpuRVV8fSV9D2Pu+KWevqqQ78Qw3syNP7mb9TdIqtThG7blhcLjqSlI8Cn0K/JGf4nuK9vahpYC5HShiE8E6eLGxg80ludSaU2uopI9/y54zek9f61xzYbdAAAAAAAAAAAAAAAAAAABrnO2brG0941q2UL9qJMQKa3szHRt302Qf5uMyk/WcWf8ALqo/ClRjLbtuy37Etqp3hdtWj02jUiOuXNlvq4oZaQW5qMUDa4dYVzasclu1JtciDZNEdcj27SFK4mlvyOS6XvPObbn8CdkF7VKDX2o/UNfWpjJ9QyXfMlJLkbtU+A2pRsU6IRmaGG9/s36q95W6hJPs2dC7+oS62ssZKpCk44t6SXdMPN7JrkxB79wXxMIP84ft9T4uOq9Euj26NWWSW6Z3ciBZdFcbkXFVyR6jR9SjNKPob7m2xfCndfs4qv2s+z7bsC2KZZto0iPTKPR46IkKIwjihlpJbEX/ANz9oDvEIShJJSniReRD9DrZ9eolMmwabU6vBiy6o4pqCw9IQ25KWkuRpaSZ7rMi69B2QAAAADiTZsOmQ3p8+SzHixm1OvPOqJCG0JLdSlGfQiIhyxVB2q+uEpz0/S3iqrq7llXdXjUo6/XWXX6PQovYX6b/AKv9YkBoTtFdbs/UzfK7GsWc4zja2pCihkkzSdYkp6HMcL4PMmk/D4vWVxTiGgPShP1QZqiRqtCc/oVbKmqjcb+2yXGyVu3EI/jeNJl+wS1ewaQxTi+8sy3/AEXGlgUldQrdckkxHb8kIT5qccV7jaE8lqV7EkY9DWmHTraGmHEtLxlarLbrzX5VVqjx4rqM9RF3j6/5ElJe6hCEgNsMsNR2ksMNpQ02lKUISWxJIvIiH2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfCRIYhsOSZLqGWWUmtxxatkpSXUzMz9g/r77MVlb77qW2m0mtS1q2SlJdTMzMUz9ot2iUvMUyo4RwpWFsWFHcVHqlVjOcV15ZH1Qgy/4qR/8AW+fq+YbI1wdq06TlQxXpaqqEpSpUao3k115exSKf/wD6P+r91wVcT586qzpFSqUt6XKlOKefffcNbji1Hupa1H1NRn5mMgxxjW+MuXhT7Cx1bkyt1upL4x40dHu+8tZn0QhPtWo9iFyuj/su8Y4OjQL0y7HgXtfSSQ8SHUc6ZTHSPl9S2ovrlpP9K4X7KUgK9tMXZsZ+1FJi3DOglY9nPcVlWaxGX3shB+9GjeFb34qNCD9ixaVgPs39MOCG49Rbs1F33AwZOFWLjSiWtCyPcjaZ2Jlvb2KJHP5hKcAHzQhLSUoQgiSXhIk+REPoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwfMeXbJwVjur5NyBU0wqRSGeaz3LvH3T6NstF77iz8JEAwXVxqls3Sji2TfFw93NrMvlFoFHJey58vboXyto6KcX7qfLxKSlXn4yllC88x35V8jZArK6lW60+qRIePolPsS22n3G0lslKfYkhmOpvUhfOqLKE7It5vk0z4o9KpqHDUxTIRK8DKPtV7yl++rr9iRvLs6tDU/UreaL/AL/gus40tySn0klbp+mZSepRGz/Vl0N1Ze6fEvErkkNz9lfoWerlQp2p/LVHWmmQXUv2hTZCP8qfSfSoLSf6NB/mviV4/JKeVt44kKFDpkNmBAjMxYsVtLTLLSCQhtCS2SlKS6EREOWAAAAAAAAAAAAOFU6nTqLTZVWq01mHChMrkSZLyyQ2y0gt1LUo+hJIi6iqjMXbQ3XTr/mU/COO7cnWlBkKZan11MlUipIT075CGnGyYQZ+qlZLVtsauJ+FIWyAIpaFtcLOsWlXC3Kx9Ktqr2t6N6abcj0iE8T/AHnDu3DJKiX9UrdBl/EoStAAAAAAAAAAAAAAAAAAAfhSkoDvEgP2A+ffNcu65+P4faP73iQH7AfhLiVj9gAAAAAAACKHaU57/wABemCuppkw2LhvTe26V3azStsnkK9IeIy6lwYJzZXsWpAleKMe1hz0nLWpJyxKRM76hY2ZVSG+KyUhVQWaVTF9PaSktMn98cBCUBlMGwK3Nx1WMnGgmaHSapDovfLSf5RNkofdS0j2eFqO4tX2eD4hy8MWw1e2YrFs19rvWq/ctLpa0H15JflNtmX98B6R8U243Z+LbNtJprukUSgU+mpR5cSZjIb2/uDLQAAGhNa2ouJpkwFXb9aeZ+npiPoy3mF7H3tRdSru18TMuSWyJTqvuQN9iiHtPNTqs9Z7fte3Z/fWfj9T1JgcFfVyZm+0qRt960k2k/haJResAh9Nmy6jLenz5LsiVJcU6886o1rcWo91KUo+pmZi+zs1dOv+L/pxpcitwSj3VfHCvVbkjZxlC0fk0Y9+vgaPc0+xbjoq07OfTKvUhqAp/wBNwCes+zVNVqvKUjkh7Zf5PFP+tcT1L4EOi/4AAAAAAAABjl45DsHHUBFVyDfNv2xCcVxRIrFSZhNKV9hLeUkh9rVvazb6ppViyLtotwwFerKpU9qWyrf52jUQDvQAAAAAAHzccbZbU46tKW0luZn0JJEPoKxu1P1zHbUOdpixLV/+FJzfd3dU46+sRhRf5A2ov0iy/O/Yg+HvK4hoHtLddCs+XK7h3F1YWrHlvSj9Llsr8FdmoPbvOnrR0H+b9ilfWfq+MX9OuAb61J5QpuMbFil38pXezprqDNinREmROSHdvdTuWxe8o0pGI2HYt15Lu+kWJZNHeqlarklMOFGZR4nHD+32Eki3UpR9EpI1GPQBoy0kWnpMxe3blOS1PumrE3IuKskjxS3yLo22Z9UsN7qJCfvUrzUYDPcCYNsfTvjOlYvsGnkzBpqN35K+Pfz5Kvzkl5Rea1H/AKJESS8KUjs8uZXszCePq1ky/qmiFR6Iwbzpn67yz6NtNl77i1cUJT8RjNRRd2mesV7UNk5WOrMqfeWBZUlxqMbSvBU6gndDss/iQnxIa+Xkr9IA0fqQ1QZF1I5beypcVTkwDhvbUCBGkGlFHjpXyaQ0otvrNyJSnPNS/F08KU289mLqCyxqAwbMnZVpsmRJtycmlwrjeSSSrDRI3Pf43WvVWvyVzR7xLFZ2h7Qlemqy5Wq/Vm5FDxzS3yTUqvw4rlqSfWNE39dw/eX6qPx4pVexY9kWtjq1aXY9l0WNSqJRo6Y0OJHRxQ2hP+0z8zM+qj3MBkIANWakc/2dprxTWMo3i7yRDR3NPhJXs7UJqkn3Udv8T8z91JKV7oDQvaOa0I2mjHX9DLKqSf8ACNdUdaadwMlLpUQz4rmrL2H5pa381kauvdqIUYtt1Sv1RLTSJM+oz3uJEnk69IeWr95rWoz/AH7jKMu5YvPOGQ61k2/KicysVuQp5w9zJDKC6IZbL2NoTshJfYQsv7LLQs5S2qbqgy5SiKW8jvrPpUhv8yg//wAwcSfvqL8yXsL6z2t8Q3v2dOiSBplsUr0ventuZJuaOn05S9lHSop7KTCbP7eiTcMvNREnySQmaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANA619SsHS7gir3404yq4Ju9Lt2OvxE5UHEnxWafeQ2lKnFfscfeAQz7V3W09BTN0sYuqq0uvNpTeNRjr9VCk7lTkKL4iPd77tm/1iRWtiLEt85wv+mY1x3RV1KtVVzi2j1UMoL13nV+42gvEpQ6Ja7kvi6FOrOXWa9cNQ5GZ8nZE2Y+5/Na1uL/eoxfJoF0Z0rSljZMuuRY8vINyModr01OxlGT5ohMn8CPeV7691eXHiGUaQNHePtJdjJpFCaaqd1VJtKq9cC2uLstzz7tvz7thJ+qj+JW6hIQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHW1+vUW16LOuO4qlHptLpcZyXMmSFkhphhCeS1rM/IiIhQnr31oVfVfkX0agvyImPbbccboMBe6PSV+S5zyP1iy9Uj9RHh9ZTnLePaj653MkVuXp0xRWOVqUh/jcVQjr8NTmIV/kyFF5sNKLr8bnypSaoU4HwjfWoXJ1JxdYUE3qhU1cnpCkmbMKMn85IdUXqtoL+auKS8SkkAz3RvpKu3VnlBu2IJu0+2aV3ci4qySN0xY5n0bRv0U85spKE/io/Ckx6ALBsK08Y2dSbAsijM0uiUSOmLEitF0SgvaZ+alGZ7mo+qlbmMR066frE004wpuMbEiH3Mcienz3EET9RmKIu8kOn9p7dE+6kkpL1RtQAAAAAAAHHkyY0JhcqU8hllpKluOLURJSkvMzMxqqt6t9LttyXIVZ1B4+jvsq4OMlcMVbjavsUlKzMhiWv3GF1Zc0nX7aFkokvVn0ZioMRWN+ctMaQh5xgkl6xqbbURJ9quI88akqQo0qLYy8yAei5OuvSApzh/jD2Zy/wD3AuP89h2UXWXpNmfmtSGOk/11xRWv/Gsh5vQAWddqRrvoV7U1GnvB14Q6nRZCW5NzVqky0Px5qT8TcJp1szStBdFumk/W4o9jiRXLZNsned2Um1EVujUf6VlIiqqFXmtw4URKleJ155wyShCS6n+HTqMfAB6CtM1R0a6d8Y0vHGN8641kIR9dOnJuiAp6pzTIicfcNLp9T2IiT7qSJI3nCyti6o7fR+SLWlb+Xc1iMv8A2LHmCAB6m4lYpVR//D6pDlf1LyF/7DHNHlXGS0vJmR6GlKaLf9yQEl5FFqr7X/hWQD1BgPNJT9TWo+kmk6ZqAyPG4+SWbpnJL+ROjNaXr+1k0YiTE1B3O5t/ypbUr/eoUA9EwCgWj9qPrfpLqVu5ibqDaf0Mug01ST/elhKv9Yzql9sdq4gEXpUCwKlt/wAqozyf91IQAvAAU90TttsvxkJ/pLhiz56/eVBlyohK/AlqdGcUHtxIC3SRc+nOQy37XYFzJdP/AKtcZP8A4gFpgCvCl9tdp4fNP0xjLIkQ1efo7MJ8k/zkIG9cQ9oFg7NtwUy27Rol/tS6q6llhyZbL6Y6Vn5d481zbQXzGfEBI+W+xEZXKkvIZZZSbjji1cUpSXU1GZ/YIOxLxztr7uWsNYmvupYtwNRpjtN/pJTUcK1dLyOjhxlnsbDHzl/FyVybb3D2g92VWytG+T6zRlrRJepKKbzbPZSUS5DUZw+n+bdUNjaf7Mo2OsJ2JZNvNIRBpVAgsoNBeF1Rskpx38VrNSz+ZYCNcLs19I1UecYp163nMuVs1KXVmbzUupJWXmtW3h33+QdXOuzO+gK4aT/hQvmrZSwJV5bNOcr9UTzrVqOrMkNqkOFv37G/vf6PE+KXITYfp9GufOFLtHF1iXDHzSnME2rIupmYbEBu3mHzOSyaTc2Xx4uGou79Xw8lcuIuGzrZVGyRhu9rGuBpC6fWqFMjuG4X5tXdKNDn4oUSVl8yAGbRJMeWy3KiOoeZebS4042rdCkGW5KIy9hjliOHZ4XVVLy0bYwq9ZdU5JZpbtN5r81NRZLsdr/u2kiR4AAAAAAANW6mMywcAYNvDLEs2TfodOWcFpz1Xprn1cZv8FOqb3+7cecFKbhvq50toTJq1er8/iRF43pct9z/AFrW4v8A1izLtpM6m/UrS070eZ9XFT/SStpSo9jdUSmojStvsT3yzT87Shg3ZCaZDv3JEzULdMHlQrId9FoxOI8MirrR65f1La+X7brSvdAc/Xxg+maYNEOHMMxyZOqv3E7WK6+3/wAZqXoaieXv7xJ71LafkQkR57Ny1juzWjjWKqMbjVPmyao4fsb9GiPOoM/7RDYmN2489TdIw7S/ZIk12Qf9miEX/qmNQdjBajlV1KXFdS20qj0G030kv2pfkSWEI/7tDwC6cAHHlS40CI9MlvIZjx21OOuOK2QhCS3UozP2EQCKvaPanU6cMBzY9AqncXnehOUehklf1kdBp/KJZF/m0K2I/jW0KG7foNYumuQLZt+nvT6pVZLUOFFZRyW+84skoQkvtMzIhvbXPqVlans+Ve74Uh1Vr0rlSrcaVySlMJtR/XcTPot1XJw/xSn3RNLsj9HpsoRqpyDSOLjiXI9nxX0eqk90Oz9j+3xNt/dzV8KgE0tF+mWlaWcJUuw2+5er87/hG45qD5d/PWlPJCT/AFbZF3afuTy81KG+lKSlPJXkNd5wzzjLTxY8q/so19FNpzB92w0nxyJr5lullhsuq1n/AKvWVxT4hSxqz7R7NGpKRLtuhzpFmWG4am00anyDS/NaP2zHi2Nzf9WXFv5VH4gFsOWe0D0lYamvUi5sswZ9VZNSXIFEaXUnW1l5oWbJKQ2r7lqSNR0Pti9I1XrZUqdDvyjRlK4/SU6jMqjfjsw+49/3Yo/H0cbcZcU06hSVpPYyPoaTIB6jLVuy3L4t6DddoVqHV6NU2Uvw5sR0nGn2z95KiHcCtXsUL4uGrY0yJYlQXIcpFu1aBLpqlqNSG1S23u+bRv5FvHSvb7Xd/eFlQDzxa+8kXpkbVfkVN4zJK27cr02hUqK4s+6iwYzymmu7T5J5kjvD+1SzGnse5LvzE9yx7vxvdlTt6sxj8EuDIU2pSd9+Cy8loPpuhZGkxOHtfdNr1gZYi5+ojPKh36pMeol/yaqtNbfydab5/tId+4V6AL+Oz61lp1aY4nNXPHjw75tVTLNbbYRxZltuErupTZe7y4LSpHuqT8KkiWAq27FzDF30eNeOcqzGXDoFcjN0ak9509NU28an3iL4EKQlBH8XP4RaSAAA1dqJz3ZumzFNZynez6jZgo7qFCQvZ2fLV+ajt/eo/M/dSSleSQGle0M1owNLWOf6P2pLadyLdTK26Q10X9Hs+qua4R/D5II/WX8qVCiN56sXHWFvyVzKpVapJUpalGt6RKkOL6mfmpa1KP8AEzMZTmPLt6Z0yPWcnX9UvTKvWXjcMiP6uO0XRthovdbQnwkX/mLKuy10JOUtum6nsw0gvTHUJes+kyG+rKD8qi4R++ZfmS91P1nmbfEN19nFodY022ajIeQqYy5kq445d8lZEr6FiK6lFQf609t3VF7fB5J5KmyAixr31m0zSXjhKKMcafftxpW1QYLmxoYSXRcx4v1aN+iffXsny5GkO/133Bl2j6cq/ScIWnXq9ddzutW/HKjRHH34TEjl38nwdUETSVoJ33FrQoQU0m9kNctZnRbz1RK+iKU2onG7WhyCVLlf9JfbM0so+Rs1LP4mxF+x+0V1iWTc53K1mWq1w3pJyJFPrnGZCe36mju1bdyj7mTb4+7xF5uAMjXHlvD1qZJuqy5Np1OvwEzH6U+rkpndRkS0+3g4kkuJ5eListwGYW3bVAs+gwbXtWixKVSKYwmPDgw2SaZYaT5IQguhEO2AAHAq1WplDpcut1mczCgU9lcmVJfWSG2WkJ5KWoz9UiItxQRr11f1LVZlh1+jS5LNhW2bkW3YSuSO9Tvs5McQf6R3b2+qgkJ8+XKWPa2azD5PaVsb1RRfm3rxmx3P4m6eRl/Ct3+BH6xIrgxxb1sT6kVfyDUZEK1KWpLk70Xj6XNPzKJFI+neL8uZ+FtO61e6lQSp7PTR1QcpTH9QWeVQ6TiS0HDdU5VXUx4tWlN9TQtbhkn0Zv8ASK8lH9X+s4zzvjta9H1jVL6FpNQui6UMr9HW/QKSk47XHp0VIcZ5p+9HL7hUbm/Ujf2am6dbspTNvWPbzaY9vWjTFGin01hPRHT9M9xPxPOeJSjV6u/EalS06ttThIUaE7EpXsTv5APSHp/1W4Q1NUyVUMUXcc2TT+Pp1NlMqjzYqVeSltK80ezmnkn5huEeezs6bwrdmaxscvUeS62mr1E6NNbQfhfjyEGlSFF7SI+K/wAUJHoTAAAR81L63cFaXYao183D9I3I42Tka3KXs9OcI/VU4W5JZQfxOGn5eQCQY03mjVxp30/IcZyhk+lU+ooTyKlR1nKnq38vydklLTv8SiSn7xULqH7UfUZm1cqk2tVP8HdtO8kJgUN4/S3EH+tmbJdM/wCr7pP2pUIe/llSmfppUqU5961urUf8zMzAXmYF7UXDWoDNrGHKTa1doTdWaUmi1WqLbT6bKTyUbC2kGrueSE7oV3iuR+Hwnx5TUHnmxJplzjZ12WNla9KZHxhQI1xwXYlfvKWikNJfacS8RpbeNLy/C2pRcUcenrD0E0at0e4qczWKDVIlSgSU82JUOQh5l0vtQtJmRgOwAAAB09buq2LaNgrjuOl0r0pRpY9Oltsd4ZeZJ5mXLzGvtR2o7HWmDHMnIeQ53xM02msrL0qpStt0stJP+8v1Up8Rig3UnqTyNqjyNIv6/p5EhBKapdLZWZRaZF33JlpJ+34l+stX7iAekSPIjy2USYryHmnE8kONqJSVF9xkPuKr+xjsvNcdVyX5UKxVImL5MRyn0+nylqOPOqRPINciO2fRPdpQ4hSy9ZS+Pi7tXGZepHXLgLTEw5DvW5vpO5OHJq3aQaZE5W/l3hbklgvvcNPy8gEhQFLWUu2V1CXLNeaxfbFuWZTfJpTzR1KaX3m47s0f4d0M20RdqBmq6s0W9ivPNTgXJS7wqDdLi1NMBmHLhzHlcY5ETCUNrbU4aUGRp5ePly6cVBbeAAAAAAAox7V7UC5lrUbIx/SZ3fW/jhCqU0lCt0OVBWxzHOnvJUSWf7EXQ5XvyLjDGF2ZHnI5MWzRZlWWj4+4ZUskfvNOw800GJc+UL9jwWTXUbiu2roZSaz8UmbKe26/epxwBYh2P2lhq5bim6mbxppOQLffVTbZbdR4XZ3H6+URGXUm0q4JV8al+82LdhgeE8U0PB+J7VxTbiUehW3TmoZu8CSb73m68e23iccU4s/vWM8AAAAAAAAABqDUDqowtpooP0vlK7mYsp5pTkKkRSJ+ozdv1TBHvt86uKC9qgG3xrXLuo7CGB4BzssZKotvqNs3WorzvOW8kv1cZHJ1f8KTFSWo3tbM55RdkULEDf8Ag4txXJsno60v1WQjqW65Blszv0PZouSf1ihByrVarV6pP1it1KXUJ8x3vJEqU8p155Z+8tajM1H+IC621u1x0/3jmWh4zpVuXDGodblpgJuWf3bDTchxSUsfUkaldypZ7GtZp4eak8eXGdo82tu6Vc6V211X7OseTbFpMqZS9cVzLKlU9tLqkpQsnH+JupM1JL6sl+Y9DGJ7jpl048t+o0y86RdRpp0ZmTVaVNRKjSZCW0k4tLiDPzVuYDMgAAAdbWrgoNtQ/pC4q1ApcXklvv50hDLfM/IuSjItxjuWssWJhGw6nkfI9capdEpTZqddV1W4s/UaaT5rcUfRKS8xQvrH1lX7q4vg59TN2k2hSnFlQaAl3dDCT6d89t0cfUXmr3fVT8wehGBUqfVoqJ9Knxpkdz1Ho7pOIV+BluQ5Ypc7H+ys11TNrt52xV6pTsc0Vl5u5CNSvQqlIWyomYxIPwreStTbvIvEhKPZ3ieVoOf9V+DtNFH+kcpXkzFmutm5Do8X6+oy/Z9WwR7kXzr4o+YBuIBTnmDtoMt12e9DwvYdEtilpNSUSqsk585wvYvYjS03+zs5+0OhwD2tmoWh5Fpbebrgpt02lUJbbFRJVLjQ34DKlbG6wuOhG/AvFxcJXLy3T6wC6oAAAGJQMsYtq1zuWTS8l2rLuJn85SI9ZjOTUfiwSzcL+QrL7VvWzcUW6T024iu+TT4tPa5XdMp7xtuvSFbGmCTqT3JCUdXUl5qXwV6qkisKFNmUyYxUadLeiyYriXmH2Vmhba0nulaVF1IyPyMB6VM16g8P6e7fTcuXL2g0OM8ZojMK5OSpSi9jTDZG4595kWxe0RutrtetIlxXCdBmSLwoTCnCbRU6pR0eiL3Pbf6l1x1JftNpFK9+ZFvrKFwvXXkK66pcNYkJS2uZUJCnnTQn1UkavIi+whjakqT6wD1LUSuUe5KTDr1v1SNUqbUGUSYkuK6TjL7Si3StC07kpJkOxFf3YyXtXrh06XDalWlvSIlr3GtqnG55MsvsodNlP3E53i/7UWAgAANB65syVPBOl697/t+QtitJit02lvIMubMqU6llDqd/a2S1OF+wA1bqV7UXBWn255lhUmn1G+LkpylMzY9LcbaiQ3kn4mXZC9/GXtJtC+OxpVxV0GpMfdthjOuVVuDkjDdatWI64lBTYFVRVUtkfvuINplWxfLyMVEflVQlfpZEiQ5961uLUf8AMzMx9KhT51GnSKVVYb8OZDdWxIjvtmh1l1J7KQtJ7GlRGWxkYD08WJfln5LtWn3rYVxRK5RKm2TsWbEXzQ4nyUX2kZH0NJ+JJ+YyQUwdj1nyuWlm+RgifUVuW9e8SRJiRFbqSxVI7SneaPYjmw28Svi4NfCLnwAV79qDrhPD9uPYCxhWDRe9fib1idGXsujwHC9VKi9SQ6ny95CPF0NTahIPWpqst/SjiSRdT62ZN1VY3IVtU1fX0iVt1dWRde5aIyWr+FPmpI8/F03TcmQLpqF2XRUpNXrlalrlTJTvidkPLPczPb7/ACIgH4tK07ivm5adZ9pUmRVKzV5CIkKHHRyW86o9iSn/AO4v50P6Pbe0m40TTX2o829a0ht+4aqhHIlLLqmM0Z9e5b36fErdXyp1F2aWhRGBLabzJlGloLIdejF6LFdR4qFCWX5v7n3C/OH7qfB8fKeYAA6q5Llt2z6JLuW663Ao9Ip7SnpU6dIQywwgvNS1qMiIVval+2MtuhuS7V01W6ivSkGps7lq7S24SVfbHj9HHf2nDQXyqIBZDcNyW9aVIkV+6q9T6PS4aO8kTahIRHYaIvapxZklIhvmnta9MeNCkU6xnqjkWsMmpKUUlHcQOZF78t0tjT8zSHRTplrPWYc6Vj6cyxkKsXHISo1NNynto8ff9UwjZpr+BKRxsbYWy1mKpfRWLsdV65n0rJtw6fCW60yoy3+td24N/isyAeijAWcLN1FYsomWbJcfTAqzakuRnvz0OQ2ri6w5t7yVl/EnZRdFDZIr47Jqgv4ms298X3jkC0HLicuD0j+jMCvRpc+A620TMjvUNKUW+7aU+E1fmhYOADBavg/CtfeclXBiCyqm86o1uOTbfivqUo+pmaltnuM6HHkyWIMdyVKeQywylTjjjiyShtBFuajM/IiAR9zRjDRXhLHtbylkLT9iuPS6QybrilWfTTdkOn0bZbI2vG4tWySIUJ5XvmPkrIFavSHZ9BtWJU5KnItGocFqJChMFsTbSG2kpTuSSLde3jVuoST7RnWbI1N5K/onaFQUWOrSkLRS0oWfGpySLiuasvv8SGvsRufTvFDVekbTFdOqvLkGwKOT0SjR+Muv1VKOSYEIj6nufTvF+ohPtV9yVAJBdmVohTnq7EZhybREvY8tuRxjQ5TJG1XJ6f0ZpP12G/NfuqVsjxfWbWt/4pOlX/m1Yu/7IQP/AGhnFjWPbGObQpFi2bS2adRaHFRDhRm/VbbSX94z8zM/Mz3GRANS/wCKTpV/5tWLv+yED/2h+k6TNLCS6aasV/xWdTj/APSG2AAap/xUNLX/ADaMV/8AY2m/+yOUjTLptQkkp0+Y1SlPQiK04H/tDZgANbo026dWD5MYExw2f2ptaAk/90Pt/i84B/8A0Ox9/wBmYX/tjYQAMCbwHgxpPBrC1hpSXklNuQyL/dj9pwVhFJ8kYcsdJl5Gm3of/tjOgAYgziHEzBfUYvtJvj5caJGT/wDQOwjWJY8T/JbNoTH9XTmU/wCxI78AHDYpVMhl+SUyIzx8u7ZSn/YQ5gAA19nfFsLNeILvxTPeJhFzUl+C2+ouRMvmW7Tu3yuElf7hpHQtn7+lFltafMmq+hstYvYTQqzR5i9npbEZKW2pjO/55Cm+75KL3vF6qkqVKpz1iGjc/wCkHEmoeTDuC4Y9SoF30sk/Rt1W/KOFVIhl5F3pEfMi5dCWXT3eIDStoaArususWhelEyPSW7ptPJNVu5Eo4TpNP0ioJaKRT1ER78zJv1/LxqGa65c//wBDbKdwJjX/AIay3k9hVBodGhrJT0ZmQSkOzHf1SEt95xUfveL1UuKT0v8Aidapu4+hk9oVff0L6vD6BY9P4f8AS+97zf5htDAekHEmnqVMuSgtVW4rxqqdqlddwyzm1SVv6xd4fqEe3UkF197kAzHAGLIeEMN2fiiHIS+m2qU1DefT0S9I9Z50i+Z1TihsUfJv1jH1AAAAAdfWq1Tbeo864KzLRFp9NjOzJb7h7JaZbQalrP7iIh2AhT2sGbixXpilWdTZfc1nIskqIySVFzTCL6yYvY/dNviyf/SAFSORbhvXV/qdqtcolPdk1zIlwlHpcVXm00oyajNr232S2yhtKlewkchf/gPDduYBxJbWJ7YSSo1CipbekcOJy5KvE8+rb2rcNSv37Cu7scdMiVfSeqG7Kfvx72j2ql1H8MuWn/cJP+vFqwCqjtzPzuFf2bj/AP64czsPbYU3TcsXm76r79JpjP8AAmQ45/vGx9O3Gpxu0PD1WI+keXXI/wB31iISv/SGxuxboqoWmW56y63xVUr0k8FfE03DiEX943AFgIgL2tep3/BXiBGE7YqHd3LkJlxuaba9lxaOSuLpn/XH9UXy96Jw3fddCsa16telzz24VIocJ2fNkueq0w2g1LV/Ih55sl3dkvXNqilVGjUx6XW71qiYNCpqldIcJPRltR9SQhtoubi/V/OrAZFoR0kVTVXl1imVFh9mybfU3LuWY3ujdrl4Iray/SOmW32pTzV7ovLyfkjHOmzEc69bjJmkW3asJDMaJGQlO5JSSGIrCOhcleFCU/8AkOm0v6drS0wYhpWM7XabdfaT6VWKiSeK6jPURd6+r7uhJSXuoQhIqu7XDUlOyTmosI0Sar+jOPlpKShK/DJq60burP8AqkL7kvhV3vxAI0andTWQtUmSZd+XxM7mM1zYo1IaUZxqZDNW5No+JZ9DW56y1fLxSnYulTQTkLUNDTfl1ViNYGNIyt5Fx1Yko9JIvWKKhZpJf3uKNLaevVRp4iLA5UupT56GWpk6RIRFR3bKXHVLJtH2J39UgFiWUc6aMNHlpS7E0c2/TbzyU+wqK7f05KJ/0apSEkp5iQouC3vhTHJLRK8SuXHiquqTJkTpDsyZIW8+8pTjrrizUtazPczMz8zMc+2rWuO8a1Ftu0qDUKzVpq+7jQafGXIfeV8jaCMzFrWhLstpFm1Sn5f1KwYz1VhqblUi1OSXW4zpdUvTFFulayPyaLkkveNXqpCQHZm6falgPTRT1XPAXEuS9JKrhqMdxHFyMhaEpjsmRkRpNLSErNJ+qt1ZCVNVqlNodNlVqsTmYcGAyuVKkvLJDbLSE8lrUZ+RERbmOeKn+1f1rInPy9LmLqsvuWFJK8Z8dexOLLqVOSovYXrO/fs3+sSAivr11eVHVVlt2TRpclmxLdU5Dt2EvdBOJ3+smOIP9I7sXn6qCQnz5CL4z7CGHbrzzkui4vs5hB1CsPcVSHT2YiMJLd2Q6fsQhPX7/VLxKIhahqq7MmyHNLlEpGCKImRemPIrkhuQlP5TcTSvHKQ4Zeu4pXjaL3du7T0UA6Xse9T7ddtmdpjuyomdRoKXapbSnFdXoSlbyIxb+1txfMi+Fa/Y2LNB5gcfX7d2JL8ot/WhMXTq/bc5MyKtST2StB9ULLpulRckKT7UmZD0RaY9RFoancS0rJtpvttuvJ9Hq1PJXJdOnoIu9YX/AD5JP3kLSoBtCpVCDR4MiqVSYzFhxGVvyH3lkhDTaS3UtRn0IiIhQTr+1e1HVTlpxVDmSG7CtpbkO34ijNJPddnJq0/G7t039VBJLz5CYPa46wvoqnf4rePqqSZs5pD94SWHT5MMHstqDuXkbhbLc+TgnqlxQhLom0jXNqzyg1Q2yep9oUVTci46slBH3LBn0YaM+nfO7GSfhLkvrx4qDcPZpaGF5+uhrMGUKMs8d25J/JozyPBXZqD37rr6zCD/ADnsUr6v9Zxu1bbbZbS20hKUJTxIk9CSRDprPs+3LCtemWbaNIj0yj0eMiJChsI4oZaSWxF/9z9o5VxXHQLSo0u5LqrUGkUmA0p6VNnSEMMMILzUtxZkSSAcC/b4tvGtl1y/rvnHDo1AhO1Ca9ty4tNp3PiXtUfkRe0x5y9SWd7p1I5frmVrqUpCqk53cGJz3RBgoMyZjp/ZT5/Es1q94TK7S/X/AGXnK3GMHYPqcydbzU/0mv1VTJtMVE2TI2WWefiW0TnjNRkndSGuPIhDjTTgO6tSuYKHii1i7o5y++qExSd0QIDZkbz6vwI9iL3lqQn3gEnezF0VIz1eacxZHpBrsO1JafR47qfBWagnZRNbe1lvwqc9ij4o6+Pa7VKUoSSUlsReRDFsaY5tTEljUTHVjUxMGi0GIiJFZI/FxL1lrP3lqPktSvaozGVgAjhro1WUzSphqXcEJ5l28K7zgW1CcLkSpG3jkLT+raI+Z/argn3hvu5Ljoln2/UrquWosU+k0iK7OnS318W2GG0Gpa1H9hERjzw6ydTVc1T5qqd/SlvMUGJyp9vU9xXSLAQZ8DMv1jnVxfzL4+qlIDTFWq1Tr1VmV2tTnp1QqMhyVKkvK5LeeWo1LWoz8zNR7mOEPyJ4aCOzdruoJcPKmX40uj46QpLkWL4mpVe2PybPobUf7XfWV7nxJDWmjHQjkTVjW0Vd5L1vWBCe4VGvONdXzI/ExDI+jjn2q9RHvexKtt6+M+YPsqw29FWl+36dHtuizWXrlq8dKXCmy2D6Mk91N5ZL6uPGfrI4J8PIhsrX/r0odg0Z/SjpZch0en0lk6VW6tSEpaaiIT4VU+Hw6JMvJxwvLqlPi5GINaX9MOR9VGRWLGsWCbMKOaHqzWXmlHFpcUz9dZ+8s9ld216yzI/dSpSQkb2SGnur5Ez63mWfEdRbePEOOk+afBIqTzRoaZLcuvBC1Ont1Ts18Qu2Gv8ACWGrJwFjaj4vsGAcamUhripxexuynz6uPumW3JxZ9T/kXQiEbO081V1DTvhyPadk1Bca8b+ORChSG1KJcCEgi9JkpMvVX9YhCP2zUn82A1Pr97Tr+gFRqOFNOdTjv3BGJyLWrmTs41TnPJceL5kt9PXkv1W/VLkv83UjVqtVq9U5NarlSl1GoTnFPSZUp5TrzziuprWtRmajP7THzgwZ1WnMU2nRHpcuW4llhhlBuOPOKPZKEpLqajPyIXBaFOy9oOPIdOyxqNo0ar3YskyYFuv8XYlJ9qVPp6pefL7PUR8yvEkIf6TOzNzDqKbhXjdxOWLYz2ziJ8yOZzag1/8ALRz26GXk6vZPXknvBbHg/R/pw0v0r6SsmzILNQgxlLlXJVuMieaEp3cWb6y+pTsnc0tkhHyjeyUpQkkpLYi8iEFu1vz9KxXgBjGlAmdxWMkvO095SVbLRTGkpOV/p82Wv2XVgK1Nduqyqap80TKzCmPFZlAW5T7ZiGRpL0cleKStJ/pHjSSz+xPBPuiU/YwWTlmVdN0X7HuOfBx1CZVT5FONZqjVKprJKkmlBnslbTfE1LLxeNCfaYrlsezK/kO76PYtqwFTKxXprNPhMl5KedWSE7/YXXqfsHpC0/YZtzT/AIitrFFspSuNQ4iW35PDiqXKV4n31fetw1K+7fYBscYRmDLlk4Nx9Vsl5BqaINGpDPNw/Nx5w+jbLSffcWrwkkZZPnw6VCkVGpSmY0WK2p5991ZIQ2hJbqWoz6EREKGu0H1m1HVLkxVFtaY8zjq1nnGqMxuaSnul4Vz3C+1XUmyP1EfCpSgGrNUmpu+9U2UJuQLxlKYht8o9FpDa+TFMh7+FpH2rP1lr99X2JJKU7H0RaNy1B1edkfJ1URbWIrQP0iv1iU8UdEngXI4zbqtiR0/OOe4n5lJGhsXWlbt23K0m9blK3rXp6fSq1UyR3jrccv0bDf6SQv1G0fafJWyEqUnZeoDVVWcq0Om4jsGl/wBCMRWwhLNEtiK7yU8lJ8ikznC/yiQpXjPfwpV9quS1BKbVT2oaI1ERhHRtFRatqUmOmmpuGOx3Dq2EJ4k1BaMvydvb9Kr6z4e79ZUBbSs+/wDL95s25aFFqt03NXHlLJllKnpD7qlbrcWo/wAeSlqPb2qMbC0vaTcq6rbz/o5YMD0elxFJ+l69KQr0OnNH8Rl67hlvxaT4lfKnkpN4+nfS1hbSDY70a0ILDcpMbvq5ctQJPpUxLaeS1OOfo2k7Gomy8CfvVuoBUrnPQrStKGBG75zpeiZORLlfTDt+2KO4Xo8UyPk+9IeMjN7u2/dbJKUuLR4nEjHuzUxJUcqaubMfbiG5TbPf/pPUXeuzKYvVn95yO5IY7rX1LVbVbnio3RT1SXLehL+ibXh8V8kxEr6Od3+seUfM+nLqhPukLb+zm0oFpjwuiTcsLur4vHualXeaC5xEEn6iFuX6slqNXzrX7CSAlmAAAAAAIr9p1csm2tE+RHITndv1BFPpu/8Am3pzCXC/e33hCq3swLEbvnWbZKpTSHYtvJmV15Kk79WY6yaP9z62TFnfauQ3JGiS8nW/Viz6S8v8Dnsp/wBqyEAexscaRq1nJd9Zyzqilv8Aa9Iin/sJQC70AAAAAAAAR211ali0vYCql60w2V3LVHE0e3mnS5J9NcSo+9UXwttocc+9SEp94Bp/Xv2jdH04pkYrxQcOs5Hfb/KnnPrItBQotyU8XvvmR7pa9nrL6cUuUv3pfF3ZEuWZeF8XJOrlZqDinZM2a6brrij+8/Ii9iS6J9g6+s1eq3BVplerk+ROqFRfclSpUhZrdfeWfJa1qPqajM9zFm2gfsvY1cg07M2pmjLOHISiTRrRfI0G8g/Eh6cXmRH0MmP9P2tgIq6VdAObtUchmsUyCVtWb3hJeuOpsn3a/tKM10VJV+BpR8S0i3bTz2fmnHTq1Gn0S0UXHczHiOv11CJUpC/iZQZd2x5n1bSSvtUoSMp8CFSobFNpkRmLEjNpZYYZQSENoSWxISkuhEQjn2hWfpennTNcFx0Ob6LcNfUm36K6lWy2pEhKubyfmbZS8svmSkBWh2omreVnLK72KbQqhnY1iS3GCJCi4VGqJ3Q9IP4ko8TSP41fpB9OyTsjK9y6jCuCybln0a1bdj+k3UbSlejzmlEtLERxvfita18jLf1EoWouohBGjPzX24sVlbz7ykttttoNS1LM9iSRF5mY9DuhzTfE0yaf6JZUmOhNyVJKatcbqfWVPdSW7W/tS0ji0X7HL3gEhB0923Xb1jW5Urvuyqx6ZRqRGXLmzH18W2GkFuajHcClztRNbjuX7rkYExvUzVZFtS9qvKYX4KxUGz9XcvWYZV5exThcvdbUA0rrj1mXNqzyMp2K9IgWFQnFt2/SVHx5F5HKfIvWeX/cT4S95Sui0gaTLv1W5A+gobi6TadHNMq5K+tH1cKP58EmfRTyyJXFP4qV4UjUNmWwV33FCoKqpDpTDy+UypTV8Y8KOXVx5w/PikvYXiUeyU8lKSkbyy7qhjM44a026dGZls4shcvpCS4ZIqd1yj/Oypqk+qhW3hYLwpTxJW+yUpCWuoHtEsb6d7GjabtDdPp6YtHYVDcuhKSdjML38a43IjKS8pXJSpC/By9XvN+Sa3ZUy/MsXmqRMfrV2XTX5JbqV3subNfV0IveUtX2DI8GYDydqJvmPj/FtvqqNQd2XIkOHwiwWN9lPSHNj4IL96j8kpUrwi8XSHoVxXpRojM6FGar99SGSbqNySWtlly9duMg9+4a/DxK95R+wKy6z2ejuBsAVnPmqW4zospEbuKBZ9NdQqVLqLqfyduS/wCJKCI+S3G2yUrghf1iVCPWmHEdQzjnqycaQohyGatVmFTy67Igtq7ySs/waQ4N+dp1qpcz9mx6ybWqPeWXj956nwybUfdzZxHxkyvsPxJ7tB/Cjkn84Jq9k7pLdxLj57O1801bV03vGS3S2HmyJcCkb8kq+0lPmSVn8iGvmAWBiHPaHa26dpisVdn2dUGXclXJGV9HNJ2WdKjHuk5rhez3ibI/WX19VKhsDWPrBsjSVj1VbqS2alddVbcboFCJfjkul+mc26oYRv4lfwp6igfJGSLxy1e1VyFfladqdbrcg5EqQ55b+SUIT5IQktkpSXkREA6CfPm1Sa/UajLdlSpTinn33lmtxxxR7qWpR9TUZ+Zj5xo0idIbhw2VvPvKS2222k1LWsz2JJEXmZjkUajVa4arDodCpsmfUJ7yI8WLGaN1151R7JQhJbmpRn7BbvpM0bYy0P49d1QarZtOauuDH9JZZfUl1mg8i8DLKS37+avy3Ty4n4W/eWoI+4u0V2FpsxM7qg1vxSNLKUqtvH3ekl6pSzLmy1L+9W3I2S9VHJTvkpsQgv69K3km9qvetdQwVRrctUhxmI13bDO/RDLTZeo2hHFCEexKCIbY1iasrw1Z5PeuyrE9At2m95Ht6jc+SYUYz9de3RTy9kmtX4JLwpSJm9mh2e8t6dStR2daGbUaOpEy1KDMZ2W6vzbnyEH5JL1mkH5nsv4eQS37OLTzVtO+mqlUe54S4lyXPJcuKrR3PXjOPIQlpg/sUlltvkn2LNYkfdF027ZNvz7suysxKRR6YyqTMmy3CbaYaT5qUox3Ape7VvVVW8nZYe062bPkFbFnSSYqTMdfIqnV+nIjIvMmd+7JH6zvflAbpyB2m+X855FThrQvjdVSlyVqQi4KpF5uqQR7KfQwvZqMyndJ95I5fMhJj8Z70Oavb40+3Rc2Y9T9avW5KbBTV2LPpjJt0t11hXNxGyeBPOd33nDZlPj2ErNEGlC3tLGHqfRip7KryrbLMy56gXVbko07+jpX+pa3NCS/aX5qMSPAeWu269PtS4aXdFKNBTaPNYnxjcTyInWlktG5fZukSF115yw9qMyHb+UsYWpIolYqlDaO7kup4pXUkrUniW3RfFtKfrS9dJo95KhL7tP9HGmrH1o1LPNFri7Kumqy+LFCiNIdi1uYtW6+7YM0nHVx8a1oPh8nJXiqoATD7KCzJt1a0LYq0YvqLWp1SrEv+rOMuMn/ALyS2LpMmZ3w/h6jSa5kbJFv0JuKyt3uJVQaTIe4pM+DLJq5urPbohBcjFJGDuzi1ZZltyBets0KnW9QK7FQ9DqVXq6Y6ZUdfUl92z3j3A+h9W+vsGl894ro+Fsl1HGVMv8Ag3fIoXGNVJ8COpqM3OIz76O0ZqM3CbPwGvZPjJZcfD1DIdWGpK6tUuXapkeurfj0wlKi0KlrXyTToCVfVt9OnNXrrV7VqP2cRNbsstCzdZkU3U7l6imcBhzvrPpklH+UOpPpUHEH7iT/ADPxKLvPImzVo7s6dEc7U1fSb5vmCtnG1tSEnNNRGk6vJTsaYbZ/B5G6r4fD5q5JvPhQodMhswIEZmPFjNpaZZaSSENoSWyUpIuhERAOWNX6g9QeOtNuOpuRci1M2YrJ9zChMmRyqjKMjNMdhJmXJZ7H8qU7qV0GVX5kKx8W21KvHIN00236NDMidlz5CWm+R+SS39ZZ+xJeIxQNrg1TVjVTmafcrUh9FpUZbkC2YauSSbiEr8+pB+Tr3Elq/hT7oDjaq9aOXdVtzKmXbOXS7YiuGqmW1DeV6JGL3VueXfvbfpFl+ySU+EayxbiHI2arti2Ri+0p9fq8o9yZjI8LKPa464eyGkF8azJI2vo70Z5B1c3mqFSSVSLSpK0nXa+trkhgj69y0X6R9ReSfJPrK++9HBWnvFenGzWrKxZa7NOjbpVLluFzmT3SL87Id81q/up91KSAQ10ydkJjmyG41z6iJzd51w+Ln0LFWtqlRj6HxWZcXJJkf28EfIoZx2hmo+iaPsEw8aYeg063rlutpyn0WNTY6I6KVASnZ+ShtBElBlulDfzL5foxNpxxthtTrq0obQnkpSuhJIh5ytY+e5uo/UJdWRlyluUn0k6bQm/daprClJZ2+zn4nD+Z1YDVtpQrprd3UimWcic9cc6ewxS0xFqTIVMW4kmu7URkZL5mnZW49KmG7cvWz8V2rbORbpXclzU2lx49UqrnU5MgkeNW/mr7OZ+JXrH5irzsdtM6bmvCqakbpgEdOthSqXbqXE7pdqC0fXvlv+qaWSC+Z77Wxb2ACsrtaNY/9G6O5pdxzVyKp1VhLl3SWF+KNEWndELcvfdIyWv/ADZpL9IYmbq21E0PTBhCt5MqRsu1JJeg0OE4vj6bUXCPukfslspxXyIWPO7Xq5dOR7vm3BWpUutXDcM9UiQ5x5vS5Ty9zMiSXrKWroRF7QHPxjjO88wX3SMdWDRlVGt1uSmPGZLwpT7VLWryQhJbqUr2JIx6DdJul+0dKeKYdg273cuqyDTKr1W4cV1CaZeJX3Np9VtHup+ZSlHqPs6dE8DTLYab1vSltHkm54yTnqWRLVSopmSkwmz+3olTqk+a9k9SbSYmUAAOruK5LftKjSrjuqtQaRSYLSnpU2dIQwwwgvNS3FmRJIawwjqgxhqIrl0U/EzlYq9MtRbEd+vqgrapsuQvnyZjur2NxaCQlSvDtxdQZcuQDcYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKa9eb9y6xdfVD052RJW5FtzubfS4SebUd1X19QlGRfq0+BX/AEYW35GvSm44sC48g1hX5FbdJl1V/wCZthlThl+/iILdlDg2qqo90ausiMJdunJM2UdOWtGxphqfNyQ+W/Uu+f8A7jKfiATox5Ydt4vsah4+s+GcajW9AZp8Noz5K7ttO26j9qj8zP2mZjJgABXL22lJN7BdhVzj/kl2qi7/ANdDeV/6A2Z2SMVLGjKhupTx9JrVUcP79n+H/wBA5vasWg5dWjK6JjEU3nrcqFNrCCSnc0pKQllxf7m33DP7txhHZ3ZRtnEnZ0KyXdcnu6XakmsypPE/E4ZSDNDSN/fWpaUJ+ZYDX3bFanfoa3aXpltaftMraW6rcxtq27uIle8aMr9txHeH7eLSPY4Nidl5ov8A8CNjozTkCmEi+LuiJ9FjvtGlykU1Wykt7H1S874Vr+xPBHTxbxy0I6f7m1nagq/rBzhTjft6HWTmx47yd2alUi27phJH5x4yO7/Hg0jxfWELggAeafU9AqtO1H5Ti1ttxE0ryrK3uaTSajVMdVz6+xRHyL8R6WBV12nuga+b5u57UNhG3Hq3KnRm27lokJPKUpxpHBEphsuru7ZIQpCfF4CURK5K4htrEWivRdqcwHjK+V2dElSo9rU6nSZ9HnuRHVSGWEJfRJSyvgp9LvecjUXPf2jLKN2UmiqkyCfk47qtU2VyJEyvzOH8mnEClq0cj5y083HIZtK6btsSsNqL0uG289CUpW3Qn2FbEv8ABaTG3me031xsNJYRnWQaS9rlBpS1f6SoxmAvOxthfEmHoS4GL8b2/bLT3R46bBQ049/WOEXNf8Rj85NzbiTC9L+l8qZDoVsxzSamkzpaEOvbddmmurjp/cglCjCPqr7QDP8AKO2bbyXka4JK1ES41sR1R19fi9CbQZJ/HoMimdmNrruaCxeFUx+ioVKsOqVJZnXHD9Pa28nXzedIvF9y1L+JKQEm9UHbEUWRRqpZemag1BcyUy5GK66mjuCj8k7d7FjHupStj6Kd4cVF6ihVgpVQrdQUta5E2fNe5Gat3XX3Vq/ea1qMxPjF3Y1agbiq8deUbmtu0aORkqQcaQdQm7fChtBE1+83On2KHyg4ox5oA7RG1SyXGmPY5Qn0yg1qoI73u+9jG2mS5wQSVrZkmrlsnweBfwgNA2ToE1h3+w1LoGBrjZYdPwuVVLVMTt9u0tbZ7fuEg7C7JjWpAWh6Lf8AbFnJcVyc7q4ZZOp/dGaURn/ELirZuu1r1pEe4LOuOm1ymSkpcZmU+WiQy4k+pGS0GZDk1muUa3Ka9WLhq0OmQI6eT0uZIQy02Re1S1GREAoe1f8AZ95W0t2hT8nXVelMuuDWKoqFPkREPE7HlOJU4lbhuFusl8XPH8RF8Q1fpr1SZc0uXDUrkxdXYbKJ8ZLc6mVJlb8OfsrZG7aTT40clKJfJPTkXLxcVS+7UbXNj/M9DhYFw/VU1qkQqiip1qusH+SyHWkrS3Gjmf51BGvmpwvDulHHl4hHWpaGMq0TSMvVDVqTLaS5UmFN0nuj71qiqQsjnuJ234m6bO3yGaz8IDWWP7HydqrzZFtmluSK3dt51JyRMnSPIjWo3JEt9ReSEEaln+GyfdSL98NYpxHo9wtCtCBVKdRaHSG/SKrW6m+3G9LlGn62S+4oyIlK26dfCnikuiSFBeE9RWUtPEitVPE1Vh0arVyO3DeqiqexIlMR0r5KbZW8lRNktXHl068EjbFkafNb+uOsRq7UyumuU55XeN3Ddc55qmsIUW/Jk3N+SfljoV+ACwPUJ2vWDscok0PDMB7IddbNSClp5RqUysum5uqLm9/Zp4n8Y1xjDTJqb111SJl3WxdVTt/HrCkzKZZ0YlQvS0EW/LuCPeO2ZfpHOT6i9Xiniob40n9mZhzTo9Du66jbvq+I5943UZsYkxIC/P8AJo5mZcy2/Or5L9qe7EyHG0OIU2tPJKi4mX3APMPk24qNduQ7huC3KPFpNHnVJ92mQIrJNNRIfLZhlKS+Fokp+09uvUXGdlbgS3cNaf2MuXI9Dj3HkRtM5b8h1KfR6Ykz9GZIzPpyL64/20/CKvdYOme6dMWZKzZtQo8tu3ZUp6TblSUhRszYClbtkTnkpxBHwcL1iUX2KSNIwoM2pS2YFOiOypMhZNtMsoNa3Fn5Eki6mYD0bZB1maW8XNv/ANMc52my/HLk5Dhzkz5Sfu7iPzc/1CJGV+2mxLQkvwcPY6rt0ykq4Im1RaKdDP50kXN1f4KS2IQYT7NfVbmdyPN/oGuzaK6fiqVz8oRbb+7HMjfX931fE/iFjunzspcAYbQzcWQGXsl3JHLvCKpsk3TW1kX6OGRqJf8AaqWXypAVn6g+0G1J6jqVMte7bmh0e2ZxJS/Q6HE9HjuklfIicWs1POdST0U5x6eqI0jJr3uivZCvutXTWWVnVa9UnZT0dtCvA664Z902j3Up5cUo9hbJFlegTsvnDVTs0am7f4JTxk0a0ZSOv2pfnoP+ZMH/AGn6sBg/Z59mxKye5T8358o7sezUmmTRaA+k0O1r2oefLzRF9pJ83f2Pzkme1G1ZVLT3jik4dxhJ+i7ovGI4Ryopk2qk0lH1Zm0Reotw/q0KL1Uod24qJInkhCWkpQhBEkvCRJ8iIVb9rppUyvft50XPeP7cn3JS4NCaodUhU5hT8qGpuQ86h/uk7qW0opGx8S8HDdXhPoEL9H2jDIura7lRaOS6TaNLWkq3cDzPJtjfr3LJfpXzL3fdI+Svd5Xr4TwZjfT1YkLHuMqEin02L9Y84o+Uia+ZESn33PfcVt+7oSeKegpFwBrg1d4RttvEOLm2JdPgOOKj0l620SHori1mpZ/VoS6ajUoz+sNQ3VApXa26ufyOo1O6bWoEtSiW7MSi2oiUfYaWkIkPI/hcAWNZ81tadNOTEiPft+xpFcZT4aBSeMuoqVsZklTaT2Z329Z00JFMGuTVDVNV+V6fkFy0pltUWHSE0+jQpUg3TdjpfeM5O/Ek8lrUpJ8ORfVceSuIsc049kbh/HEmPdObar/hFrrZ94UFbKmaU0v72zM1SP7Q+B/AP72mehytZztSh5Gw3QIzlz2ZCVTVUaK0ltU+lkrkhpki2Lm0o3FJR7yVrJPi4pMI9djTgu1Lwvi681XI3GnTLN9FhUaIs0q7iRIS4a5ZpPyUlCOCD+d32pIXAKUlCTUo9iLzMeYKjXLkzEtwzE29cFzWZXI6vR5ZQ5b9OlNqI/Uc4mlRbH7DHfT8w6hcoGi06rlPIl2nUPqUUyRW50/0jf3CaNauf4bALt9SHaNaddPTEml/0kavG6mSUlNDoTyHlNul7sh8t22PvI+S/kFNWqDVRkfVdfib0v8AOHFZhNKi0mmQ0bMQIxr5cCNXiWs+nJZ+fyl4RKHSp2S2S8jvwru1BKk2RbXJLyaQnb6XnI8+KknuURJ/P4/kT6w4/ataVLZwbW7FvTFtpxqLZkylFb7rEVHgZnR1LcQt1R+JbjrTnrL5KV3K91AO27GrBse7MrXDnCtw+8iWVGTApSlpLj9IykqJa0/ehklF/wDyEi0PMOpDCWA6cqo5XyLSKGrgbjUNx7vJkgi/VR0buL/ckedO08sZTsSlSqJZGS7qt2nTnO9kRKTWZMRl9e23NbbS0pWexbbmNpYD0d6i9Vta+krTtuWdMlOcplz1pS2oSeuyld8ojU+vp5NktX2gN/a2O1CqufrUqeJMSW9MtyzqkZN1GpTXeNRqTRK37rg2fFllW3iTus1p6eEuSRAATv1v9nK3pbw1ad/WfWqjcxx5LkO757rRNobdd4ejONNFv3bPMnEeI1HyWjxeIQQABKPRZoVv7VlcSKm96RQbApz3Gp11TXV5RetGikrot4/t9VHmrrxSrYGhXs4bn1FyYWTMook0HGrbneNEn6uXXOJ+ox+rZ39Z7+FHxJustK0basS3INpWfRYlIo1LZSxEhRWiQ0ygvYREA6XFmJrBwrZNPx7ja3Y1GolOTs0yyXicWe3NxxZ9XHFbdVq8Qh12uWotzGGEouHremmzXMjqcZlmg/EzSG9vSPw71Rob+9PeifApN7YaDWk6saTMrzMtujyLXgtwH0o5EbCHnu9JG5kk1pcWs+O/vJ+IBmHZO6NE3zX2tTGRKUh2gUGSpu14rySMps9s9lyjSfmhlXRP+d/qxZZn7UlibTTZzl45SuNuGlRKTDp7Wy5tQdL9Gw1vur71dEJ95SRX5K7U+mQrLtnBmivBFbVU2YjFGo/0y0hxbHFBIT3cWOtffr9vJbifF4lJV1G2tNfZ7XRcd4NaidcFwP3xfkpSXo1BmPJfh07bqgn9vq3FJ9jLf1CP857ofvEaNU+t++KTmTIVRrGKcLUmc1UqBbNNkLjz6/3auTa5LhcVrZV7TPihSfzaf0on4PwlKUJJKU8Up6ERD9gAAADWOpbGDmZ8BX5jBhKFSq/RJLELn6pS0p5xzP8AB1DYo30D5KbwhrAsirXI4unQn6g7b9VS+g2zZTKQpj6wj9Tg8balb+XAx6FhTX2rOjWZj+9ZWo3H9J5Wrc8nnX2Y7OxU2pLV4nlEXk2+Z78v1vP9YkBcoAg92bmt6lZ/sKBiu/q201ki2oyY/wBeviqtQ207Ikt79VupSn61P8fvHxnCAAAAAqj7cKqz/pHEdE7xZQTZrMrj7i3eUVO5/ekv/GLXBFDtD9JE7VXiSKxaiWE3paL70+ik8pKEy0OJIn4prP1O84NqI/Lm0jl0AVsdlRgy1szajl1K8kx5cCx6b9Os057ir0uWTqG2eSFebaDXzP5kt/aL1h5hp8LJ+Er2fgSUXFZN00pSmnCSp6BMY9nQ08VbHt5l5jvJuoPUVdLJUSqZxyPVm5OzRQ5FzT5CXTPoSO7Nw99/sAXt6hNcWnfTdDkM3nesepV9tJ93b1IWiTPUrboSkkfFkunm6aRTbrH1vZE1eV6Kis02JQrSozy3qPRI581NKWWynnnTIjdcMvuSlJeqn1lK2Lpe7LbOGcJEW4ckQ5OPLPWaVreqEY01OWjfqTEVWxo3L33eJe1KXBuDtM9EdhYUwZY934WtFuDSbUlvU24Hkl3kqSmVw7mVJePqsydb7v7u+QlPFPQBovss8GR8xaoqdW6xEJ+i2Cx/SGQSkEpDkpC0pioP+1PvP7EXW5NzJizDNFO4Mp39R7ahe4qdIJC3zLrxab6rdV8qCUY82lm5LyNjtUxzH1/XHbC56Etyzo9VfhKkITuZJc7paeZFv5GM+xPgDUTqwutRWVb9bueQtxLU6u1F5fosfy37+W6e25ErfhupZl6qVAJravO1vYvC36zjPTjRZkSFVGHIMq6aiamJCmlp4q9DZSfJozLydcPkXwJPxCsQWIai+yul4J0tyck024pN03vRJbU6voiNqRDYpfFZPFHb25r7tRtrU4vbwIWrikV3gA3npW0l5N1X3ui2bMiFCo8JaVVmvyGjVFp7R/y7x0/daI9z+VPJRZtou0HZB1Y1kq1IW7b+PqfI7qo11aPG+ouq2IiD6Lc9hr9RHvcvVVeVifEdg4RsiBjzG1vx6RRaanwNNlutxZ+u46s+rjivatXUBj+nvTpjLTNYMewca0juWt0uT6g6RKl1GQRbG8+siLc/sT6qfJJENY9orqKc076cKzPokw490XWr6Aoakn42XXUK718vs7tpKzI/jNAlGKne29iXEuuYrnqYdVQWolUZbcSk+7TLUtg1pM/IjNtCNv2VANGdmlo3/wAY7JSr9vmmE5j6zJLa5bbifBU5xbLbh/Mgi4rd+Xin9ILONYWuPGWku2nIDzkWt3vKY5Um3I7pciSZbIek7fmWf7y9vD7TTV//APEYvTFmHbYwXpfpjNnUakUltup1qXEbdqk+pOJ5S30bmtplCnVK49FL4knxJ9VMRq5Xq3dFXl3Bc1XmVaqVBxT0qbMkLeffWfmtbijM1K/EBk2XcvX/AJyv2o5GyTXnapWake6lqPi0y0XqMtI8kNp9iS/2jFqLRatcdWh0KhU2TUKhUHkRYsWK0bjr7qz2ShCS6qMzH7oNArl0VqHbltUiXVKpUXkx4kOIyp1591XQkIQnc1GLldAui/Hul6oUa4s0XDbis1XTGcVR6JJqDHfU6OSDU4iI0Z8nn+BK711BHxTySnw8lOB32gLs/qDpoojWVcqRos7JEqObhmoyWxQWFJ8TTZ+SnuP5x38Uo8PJTla+uPVrdGrLLkpVOmSCsiiS3IVr0pHLZxHLj6UpHvPO+fyp4o9niv3uSjlcNu1S31SFspqcJ+GbqfWb7xBp5F+G487uQcLaiNGuUGKpWrYn0epW5O9IpNfTTylU95SVfVvsuOIUyv7SSvxJ95KVAJ66AuzCRQTpuaNStFQ7UdkSqLachHJEVXQ0PzUn6zn2M+Sff3V4U2Z1SrUqhQnKlWajEp8FhO7siU8lppsvvUoyIhRdR9Xfaa5eaRT7Uuu/q0h/i2hdBtZlvz6fnY0ZO347jaWPezH1g6gZ0a4NTeS6hQoCVd4aa1VXKzVeJmW/BvvFNt7lv67nIvgATcyp2lumPH8pNv2fcEvJlyvqJqLSLPYOd36z6EXpBfUq/gUtXyimXCdbcvfVjYVx3W4hxdwZDpc2pLV6qjfqTa3TP/TUL1tOujHA2mSnknH1qIfrTjXdya/U+L9QfI0kSi7ziRNoPb1GySkUdaqsBXdpczlWrOlw5kKC3OcnW3PQa0lJgG5yYcbc+NBcUq26pWgwHo6Gm9SOqTFOlyzXLqyJWkHKebV9GUZhaTm1F0vdaR8O5+Jw/CkVLF2ver1FpNWy3Is9EtuMUf6c+h1qnqURbd6fJ02Of9lx+URIvvIF6ZMuaXeF/XTUq/WZp7vzZ0g3HFe0klv6qC9iC8JewBnepfUpkXVNkiRf9+yibabJTFJpLKzOLS4u+5NN7+aj81L9Zavu4pTsvQFo7q+qfKLUmtQJDOPLaebkXBN2NJSVF4kQW1e1bmxctvURur1jRy7bR52c2VdTMuJdVzRpdoY9UpLi6xJY4yKg157Qm1evv+uPwF8/qi7fFeK7GwtY1Mx1jmhM0ih0lvu2WGy3UpR9VuOLPqtxSvEpavMBHjtDdUrGlPBKKVZiyh3bdbblHtxDPFPoDTaEk7KSn7GkKSSfnW37NxT1pW05XfqszJBx9RnJLMJavTa/VjLn6BCJX1jpmrzcUZ8El7y1l7OW08e2xxvdM6JjzKsGM7IoNKTLo85aEqUUR91SFtLV9hL4LTuftQn4hAPEWqrNeBLVqlrYfuWPbJV2WmTUahGp7C50gko4ttd86hRobT4jIkcfEtX2gL/Ke3hbSviumUB2sUKybOt6MUWO5UZiI6Oh9TNazLvHVrMzP3lqUIWZ77YOzaZIXaOma0JN61ySv0aNVKhHdYhd4oySjuo5bPyT3936r2esIaYu0S6zdYFwMXZeaa9Epz57u3Nesl/c2zVufctumb7xdenBPDfpzSLTdK+gPCGlthisUqAq5LyNokPXHVGiN1B+0ozXVMZP4br9ilqAQqvbSPqFyxha/wDVNrRvGrv1mkWzUqjbVope7pMBZMqNtx1tHgYSnovuUeI+Bd6r1kitiiUpytVmDRW5DLC50lqKh19XBps1rJPJZ+xJb9THqDui26PeVt1az7iholUqtwX6bNjq8nY7yFNuIP8AFKjHnu1Y6OcoaVbyl0+v0mZPtR55RUa42WTVFltGfhS4oujT3H1mz9vq8i8QC+nB2HrSwLjChYusiIhqnUaMltT3AkrlPmW7shzbzWtXiMdjkPKOOcT0Fy5cl3pSLaprflIqEtDRLP4UEfVavlSRmPOXS9RmoSiU5uk0TO2Q6fBZQTbcWLc85lpKC6ERIS4SSIZVinT1qZ1dXQUu2KJcFzLeV3cm4q1IdOGykj2+slvb8tvgTyX9iQEyNYHa3nddJqeNdNNNfiU6oNuRJtz1Jrg88ytJpUmIwf5rcj/OOeL5En4hWlSaXUK3UolGpcZcibOfbixmkes46tXFKC/EzFzmL+yZxZYGHLqolyzI915GuKhTKfGrMhjaJSZDrKibVFZPfY0q47uq8atvD3fLiKcJkS47GuiRT5rcuj163p6mXUko2pEKWw5sfUuqFocT7PIyAej/AALi+3tOWCrYxw3JiRYls0xCZ0txaW23JKvHJfUZ9C5OqcV1+0R01E9qzp7w+y/R8eTf8JNyI5IS3SXuNNZX/nJmxpX/AGROfwinCbeudc3VKLa9Suy/L+qElz8lp79QmVR1xz5GlKWaj/AhPHSn2Ql03C/DvLU7KXQqURk8i14L5KnSU+fGQ8gzSwg/hQal/e2YCGeovVbmPVBcaa7k6vE5EirUqnUeGg2oEAjLr3be57mftWs1L+YTh7JLR3HrDqdUmRKWS48N5cez4ryd0OPJPi7PMvkUSm2vm5q91ChAvU3jhzEeoPIOPfov6Pj0evzG4EdO/FMJThuRjLfrsbK2zISPpfat6jKFjygYrxjZ1j2yzSKaxR4b0CmPSZH1aEtoNtDzq2+R/Mhe6gF2N0Xba9kUaRcl5XFTqHSoieb82oSkR2Gi+ZazIiEBtQ3a/wCNLPckWtp6t56+68pSmGqnKQ4xS23dzJPFHR6T191PdpV7qxFWztGevLWzXI915or1do9GUvmVSvB1xBtIPor0Wn9FJ8vhaQfxCx7TJ2fuA9Mvo9ao1IVct3tp3VcVZQlx9tXXf0dv83H8/d8f2rUAirjHR/qm1sVqDlDW9etbpFnk4mZT7RR+SOvJ6mSfRkkSYaOKuPNZKkKT8PrCyWyLHtHHNsQLMsW3odDotNbJqLCiNcENp/8ANR+ZmfU/aMiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa/zviss24kufFC7geojdzwvQXJ7LJOrYQa0mrZBmnluRcfP2jJrRtejWPatIs23YiItKocJinQmG07JaYZQTaE9PuSO6AAAAAYZmLH0XK+KbwxpLcJtu6KJMpfeH+iW80pKV/wqNKv3ClHBkfKmbrDonZ4UaLJpUhN/VCtXbJd9WBT47Uds0LIt9+DyZKuPvO9wn3hfCNWWdpzxfYWZbuzpa9IdiXNe0VmLVuKy9HWaFclOoRtuhbh8OfXirglXHlyUoMpxtjm1cS2LRMc2NTUwaLQYiIcRkj3VxLzWtXvLUrkpSvaozGVAAAAAA6a4bNtG743ol22tR60xtt3dQgtSEfycIxhtP01adKTKOdTMA44hyVK5G9HtaAhe/28iaIxssAHDp9LptJiph0qnRoMdPqsx2ktIT/CnYhzAAAGrs/acsU6lbJOxsp0D0yOhRvQpjC+7lwH9tu9Yc68T+0j3Sr3kqG0QAVD3z2N+cLQrq6pgbMlHmRFGruzqL0ilzWkGe5INbKHEuferdH7IxN3snNbN7TWGL4v62XI7Kuj9TuOVM7tJ+ZoT3Sj/wBgukABA/TN2TWHMO1SLeOUaqvIlwRFpejsSIhMUuOsvI/RzNRvGX+cVx+QTpejsPMKjPNIWytPBTak7pUk+mxkPuADAaRgbBtvVZdeoGGbGptScVzXMiW7DZfUr7TcS2ShnvkQ/oAAAADr6tQ6LcET0CvUeFUoyvEbMyOh5G/7KiMhwqHZNm2wpS7atKi0lR+Zwae0wf8AcSQ70AAAABpmztIOmuwciz8r2viSjRbsqMtc5dRc7x9TL6zUa1x0OKUiOZ8lfmkpG5gAAAAAAAAAAABiF5YkxTkRSV5Axladzmj1VVmjRpvHb+uQocy1cd4/sZruLJsa3rfb24milUxmIn+TSSGRgADG75sGzcmW1Ls2/wC2KdcFEncTfgz45OtKMj3SrY/JRH1JRdSGSAAjtZfZ96N7Aqn0xQMDUJyUbnepOqOyKkhtRdS4tynHEp2+4hIGNGjQ46IsVlDLDSSQ22hJElKS8iIiHIAB11aotHuOky6DcNKiVKm1BlUeXDlspdZeaUWxoWhRGSiP7DGgab2d2i6l3Au5o2A6E5MWvvDakPypETl90Vx1TBF93diR4AONEiRadEZhQo7UePHQlDTLSCQhtBFsSSIuhEQ5IAADX2WsEYiztRmqBlywabcsSOo1xylJUl2OpRbKNp1Bpcb39vFQ2CADVmIdMWAsCk45iTF9Gt+S433S5raFvzFo+BUh5S3lF93MbTAAAAAAAAAB11dodHuajzbeuGlRqjTKiwuLLiSmicafaUWykLQfQyMh2IAKmNT/AGUt+WFcSssaPKlNdbivlLaoCZymKlTnSVvzhSDMu8SXsSakuJ9inB8sQdrTlrEElOPdWmLKrUZdPSlt2ezG+jqugiLp30V4ktuK+Yja/iFtgxe98Z46yZTipWRLEoFyxC6pZq1PZlJT95d4k+P7gEb7V7U7RTcrLapeTplBfWnf0aqUSYhSfuNbTa2v7459Y7TvRDRknzzWiY5x3SiHQ6i7y/eUfj/Mxzqz2a2iK4JXps7A1ObWfuwqrUIaP9BiQhP+odvbmgDRtaxoVS9PtsPcPL6SQ7Uf5+lLc3AaWLtPjytcf9B9Jenq8Mj1ZTpNqmzuNPp7CT8nXFl3hoR/W90JpWe7db1r0t2/I9MjXCqI2qps0ta3Ijcg07rS0pwiUaCPyMxyaHb9Btmnt0i26JApMBnwtxYMZDDSPwQgiIh2QDG7vxzj3IEZMO/rEt65Y6ehM1ilsTEJ/hdSohxrTxLimwVEuxcZWnbpp8jpNGjQ/wDdISMtAAHWV+gUO6aJOty5aTEqlKqTKo0yFMaS6zIaUWxoWhW5KIx2YAI3Ubs7NFtDrq7jh4EojstxXI25kiVLikfn0jPOqZL8OAkFR6PSbfpzFHoVLiU6BFR3bEWIyhpppJe6lCSIiIc8AHxdabktqadQlba08VoV1JRH5kZCPNQ7PPRhU7lVdsrAVCKe4rkpph+SzE38/wDJG3Ux/wDuxIwAHVW9blAtGiw7btWiwaPSae0liJBhR0MMMILyQhtJESSHagAAMSyPi/H2Xrads7JdoU646O6pLhxZzPNKVl5LSfmhZb+sk9xlojZrh1f29pNxe5UmXY8y9K2lce3KYs+XNwi8Uh1Jde5b3Iz+0+KfeAVydp3iXR7gqVb+OMJ2k9Sb7aUqZVW4tUfkR48JxO6EyPSFuK75SuqCSaeKN+XrNiEVn2hcl/XNTbOs+iSqvWaxJTFhQoqOTrzqvIk/+aj6JLqY5FTqd75avt2pVByoXHdV01DdaiSbsibLeXsREkvWUaj2IiFquJcX4u7LXBL2c8yMxazly4oyo0CntrSpbTqk7lBjn12IvWfe+7iXLw8g+Fo2Zi/ssMSRbgrkCHe2oa+WSh0unx0KeUl1ZkRR45JLmmOlRpJay8by/Cn3UpkrpC023DZBzs859kHXc03qRvVSc/ssqPFV1RT4xF4W0JL1uH7PqpIaQ0GYCvvL18Pa8NTajqFyXAfeWfTnmtmoEQ9yRJbbPfgjiezBfDu5uo3EqFh4AAAAAAAAwnKeHMY5utlVo5UsmmXJS1clIbmNeNhZltzacLZbK9vfQpKhmwAIJVfsbtJVSqnp8Oq5ApLG/L0GHWI6mfw3ejuOf3xtLFvZzaRMSz2axRsVx61U2FJU3Mr8hdQUlST3JZNOH3KVEfvE3yEmwAfNCEtJShCCJJeEiT5EQ+gAA4VTpdNrVPkUmsU6NOhSkG2/GktJdacQfurSrclEMVtbCeGrHlqn2XiOzLflKVyN6l0GLFc5fbybbIxm4AAAAAOLOgwalEcgVGGzKjPp4uMvIJaHC+wyPoY5QANcwtOun6nVRVcp+C8exagpXM5jVswkPqV9veE3yGfx48eIyiNGZQy02nihtCSSlKfsIiH3AAGisraJNLWbLmVeWR8QU2pVtxZLfnMSJMJ2SoiIiN447jfe9EkXj5DeoAMFxphPEOHYK4OLsbUC2Wni+uXT4KGnXtv1jm3Nf8RjOgABrnJGnjBmX5jVSydim2bjmsNk03LqFObckIRvvwJ3blx+7cfewMBYSxW6qTjjE9p25JUXWTT6Sy0+r8XSTzP+Yz8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAflSkoSalHsReZgMGzTl+zsEY3rWUL6nej0qjM94aEmXeSHT6NsNkfm4tWySIeeHURnq9NSGVKvlC+HiKTOV3UOE0s1MwIiTPuoze/up5H19qjUr3hITtMNYatRWUFWDZdTJzH9lyXGohtq8FTnluh2YfsUgvEhr5eSv0g7ns49KduXbInaqM6rapmMMfqXLaOeXFipTGC5mte/rsM+3b13OKPF9YkBvDRVp4sLRphqXrT1OMFDrioneUCmSEF6RAadTs2Tbav+OPkexF7jZ+Lj9ZxwzT5YGQ+021JTc+ZsiLZxjaMnuo1K5qVFVxPkzTWt9ufuuSHPe393vE8cBypkrK3ak6oKXjOwzkU2xqc84unsOJPuoEBJkT9SkpLzeUWxEXs5IbT6ylKuJxHiqzMJ48ouMrCprcGjUSMllpO3jcX5uPOH7zi18lqP4jAZawwzDZQww0ltptJIQhCdkpSXQiIiH3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBntT9VbuD8PoxZaNQJm8MgMOx1ONOcXYFKLwvPFt5Lc/Mp/tVF1bE16vVqdQaXMrlYmNxYFPjrlSX3FbIaaQk1LWZ/YREPOHqrzvVdR+dLmynUVupizZBx6TGcP8AyWnteGO3t7D4+JXzrWA+2lnTvcOprMFLxvR1riU/ZU6t1MtuFOpze3evK5dN+vBPzrT7BvjWzqapeTX7e0iaX4jqcX2q9HpMBmm7rVcM9K+DZlt1db7xXg/WOH3p8vq+OK3jkRrS5gh7TdYjpNZBvlludkurNKLvYDCkfUUJtZe1Da93/hWtbfxcZQdkZo9JSy1U5CpRklPeRbOiyEeZ+q7P2P8Aiaa/tVfq1AJb6C9IVL0qYmbi1eLGfvm4ybl3DNb2V3a9t0Q21fq2tz/aWalfCJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJPaj5Fk480dXY1T5PcS7qfiW40v5H18n0/xMNPJ/eKIKFVptBrEOtU1TaZcB5MiMtSeRNupVuhex9D4mXLr0+0Xx9pdgq9M/aZpFu2BRXqxX6FWoldiU9lZJdkcEOsuJRuZEaibkOK4+3j067CrDCXZv6psv3KxSanjasWPSEucZtXuSEuGlhBH1U2w5xdeV9hILifxJ9YB1eivSzc2r7M5U6orlna9MdTUrrqy1mpfdKWZ9ylw/N95XIi/jX7o9AVBoVHtahwLbt6nR6fS6XGbhw4kdHBthltJJQhJF5JIiGA6etP+PNNON4ON8e0/uorH102a6RHIqMoyIlyH1l5rPj5eqlOyU9EjaIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//Z" />
                  </div>
                  <div id="qrvalue" style="visibility: hidden">
                    <xsl:value-of select="n1:DespatchAdvice/cbc:UUID" />
                  </div>
                </td>
              </tr>
              <tr style="height:118px; " valign="top">
                <td width="40%" align="right" valign="bottom">
                  <table id="customerPartyTable" align="left" border="0">
                    <tbody>
                      <tr style="height:71px; ">
                        <td>
                          <hr />
                          <table align="center" border="0">
                            <tbody>
                              <tr>
                                <xsl:for-each select="n1:DespatchAdvice/cac:DeliveryCustomerParty/cac:Party">
                                  <td style="width:469px; " align="left">
                                    <span style="font-weight:bold; ">
                                      <xsl:text>SAYIN</xsl:text>
                                    </span>
                                  </td>
                                </xsl:for-each>
                              </tr>
                              <tr>
                                <xsl:choose>
                                  <xsl:when test="n1:DespatchAdvice/cac:BuyerCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID='PARTYTYPE' and text()='TAXFREE']">
                                    <xsl:for-each select="n1:DespatchAdvice/cac:BuyerCustomerParty/cac:Party">
                                      <xsl:call-template name="Party_Title">
                                        <xsl:with-param name="PartyType">TAXFREE</xsl:with-param>
                                      </xsl:call-template>
                                    </xsl:for-each>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:for-each select="n1:DespatchAdvice/cac:DeliveryCustomerParty/cac:Party">
                                      <xsl:call-template name="Party_Title">
                                        <xsl:with-param name="PartyType">OTHER</xsl:with-param>
                                      </xsl:call-template>
                                    </xsl:for-each>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </tr>
                              <xsl:choose>
                                <xsl:when test="n1:DespatchAdvice/cac:BuyerCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID='PARTYTYPE' and text()='TAXFREE']">
                                  <xsl:for-each select="n1:DespatchAdvice/cac:BuyerCustomerParty/cac:Party">
                                    <tr>
                                      <xsl:call-template name="Party_Adress">
                                        <xsl:with-param name="PartyType">TAXFREE</xsl:with-param>
                                      </xsl:call-template>
                                    </tr>
                                    <xsl:call-template name="Party_Other">
                                      <xsl:with-param name="PartyType">TAXFREE</xsl:with-param>
                                    </xsl:call-template>
                                  </xsl:for-each>
                                </xsl:when>
                                <xsl:otherwise>
                                  <xsl:for-each select="n1:DespatchAdvice/cac:DeliveryCustomerParty/cac:Party">
                                    <tr>
                                      <xsl:call-template name="Party_Adress">
                                        <xsl:with-param name="PartyType">OTHER</xsl:with-param>
                                      </xsl:call-template>
                                    </tr>
                                    <xsl:call-template name="Party_Other">
                                      <xsl:with-param name="PartyType">OTHER</xsl:with-param>
                                    </xsl:call-template>
                                  </xsl:for-each>
                                </xsl:otherwise>
                              </xsl:choose>
                            </tbody>
                          </table>
                          <hr />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                </td>
                <td width="60%" align="center" valign="bottom" colspan="3">
                  <table border="1" id="despatchTable">
                    <tbody>
                      <tr>
                        <td style="width:105px;" align="left">
                          <span style="font-weight:bold; ">
                            <xsl:text>Özelleştirme No:</xsl:text>
                          </span>
                        </td>
                        <td style="width:110px;" align="left">
                          <xsl:for-each select="n1:DespatchAdvice/cbc:CustomizationID">
                            <xsl:apply-templates />
                          </xsl:for-each>
                        </td>
                      </tr>
                      <tr style="height:13px; ">
                        <td align="left">
                          <span style="font-weight:bold; ">
                            <xsl:text>Senaryo:</xsl:text>
                          </span>
                        </td>
                        <td align="left">
                          <xsl:for-each select="n1:DespatchAdvice/cbc:ProfileID">
                            <xsl:apply-templates />
                          </xsl:for-each>
                        </td>
                      </tr>
                      <tr style="height:13px; ">
                        <td align="left">
                          <span style="font-weight:bold; ">
                            <xsl:text>İrsaliye Tipi:</xsl:text>
                          </span>
                        </td>
                        <td align="left">
                          <xsl:for-each select="n1:DespatchAdvice/cbc:DespatchAdviceTypeCode">
                            <xsl:apply-templates />
                          </xsl:for-each>
                        </td>
                      </tr>
                      <tr style="height:13px; ">
                        <td align="left">
                          <span style="font-weight:bold; ">
                            <xsl:text>İrsaliye No:</xsl:text>
                          </span>
                        </td>
                        <td align="left">
                          <xsl:for-each select="n1:DespatchAdvice/cbc:ID">
                            <xsl:apply-templates />
                          </xsl:for-each>
                        </td>
                      </tr>
                      <tr style="height:13px; ">
                        <td align="left">
                          <span style="font-weight:bold; ">
                            <xsl:text>İrsaliye Tarihi:</xsl:text>
                          </span>
                        </td>
                        <td align="left">
                          <xsl:for-each select="n1:DespatchAdvice/cbc:IssueDate">
                            <xsl:apply-templates select="." />
                          </xsl:for-each>
                        </td>
                      </tr>
                      <tr style="height:13px; ">
                        <td align="left">
                          <span style="font-weight:bold; ">
                            <xsl:text>İrsaliye Zamanı:</xsl:text>
                          </span>
                        </td>
                        <td align="left">
                          <xsl:for-each select="n1:DespatchAdvice/cbc:IssueTime">
                            <xsl:apply-templates select="." />
                          </xsl:for-each>
                        </td>
                      </tr>
                      <tr style="height:13px; ">
                        <td align="left">
                          <span style="font-weight:bold; ">
                            <xsl:text>Sevk Tarihi:</xsl:text>
                          </span>
                        </td>
                        <td align="left">
                          <xsl:for-each select="n1:DespatchAdvice/cac:Shipment/cac:Delivery/cac:Despatch/cbc:ActualDespatchDate">
                            <xsl:apply-templates select="." />
                          </xsl:for-each>
                        </td>
                      </tr>
                      <tr style="height:13px; ">
                        <td align="left">
                          <span style="font-weight:bold; ">
                            <xsl:text>Sevk Zamanı:</xsl:text>
                          </span>
                        </td>
                        <td align="left">
                          <xsl:for-each select="n1:DespatchAdvice/cac:Shipment/cac:Delivery/cac:Despatch/cbc:ActualDespatchTime">
                            <xsl:apply-templates select="." />
                          </xsl:for-each>
                        </td>
                      </tr>
                      <xsl:if test="n1:DespatchAdvice/cac:OrderReference">
                        <tr style="height:13px">
                          <td align="left">
                            <span style="font-weight:bold; ">
                              <xsl:text>Sipariş No:</xsl:text>
                            </span>
                          </td>
                          <td align="left">
                            <xsl:for-each select="n1:DespatchAdvice/cac:OrderReference/cbc:ID">
                              <xsl:apply-templates />
                            </xsl:for-each>
                          </td>
                        </tr>
                      </xsl:if>
                      <xsl:if test="n1:DespatchAdvice/cac:OrderReference/cbc:IssueDate">
                        <tr style="height:13px">
                          <td align="left">
                            <span style="font-weight:bold; ">
                              <xsl:text>Sipariş Tarihi:</xsl:text>
                            </span>
                          </td>
                          <td align="left">
                            <xsl:for-each select="n1:DespatchAdvice/cac:OrderReference/cbc:IssueDate">
                              <xsl:apply-templates select="." />
                            </xsl:for-each>
                          </td>
                        </tr>
                      </xsl:if>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr align="left">
                <td align="left" valign="top" id="ettnTable">
                  <span style="font-weight:bold; ">
                    <xsl:text>ETTN: </xsl:text>
                  </span>
                  <xsl:for-each select="n1:DespatchAdvice/cbc:UUID">
                    <xsl:apply-templates />
                  </xsl:for-each>
                </td>
              </tr>
            </tbody>
          </table>
          <div id="lineTableAligner">
            <span>
              <xsl:text>
              </xsl:text>
            </span>
          </div>
          <table border="1" id="lineTable" width="800">
            <tbody>
              <tr class="lineTableTr">
                <td class="lineTableTd" style="width:5%" align="center">
                  <span style="font-weight:bold;">
                    <xsl:text>Sıra No</xsl:text>
                  </span>
                </td>
                <td class="lineTableTd" style="width:35%" align="center">
                  <span style="font-weight:bold;">
                    <xsl:text>Mal</xsl:text>
                  </span>
                </td>
                <td class="lineTableTd" style="width:10%" align="center">
                  <span style="font-weight:bold;">
                    <xsl:text>Miktar</xsl:text>
                  </span>
                </td>
                <td class="lineTableTd" style="width:20%" align="center">
                  <span style="font-weight:bold;">
                    <xsl:text>Sonra Gönderilecek Miktar</xsl:text>
                  </span>
                </td>
                <td class="lineTableTd" style="width:20%" align="center">
                  <span style="font-weight:bold;">
                    <xsl:text>Tutar</xsl:text>
                  </span>
                </td>
              </tr>
              <xsl:if test="count(//n1:DespatchAdvice/cac:DespatchLine) &gt;= 10">
                <xsl:for-each select="//n1:DespatchAdvice/cac:DespatchLine">
                  <xsl:apply-templates select="." />
                </xsl:for-each>
              </xsl:if>
              <xsl:if test="count(//n1:DespatchAdvice/cac:DespatchLine) &lt; 10">
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[1]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[1]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[2]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[2]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[3]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[3]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[4]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[4]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[5]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[5]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[6]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[6]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[7]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[7]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[8]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[8]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[9]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[9]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[10]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[10]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[11]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[11]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[12]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[12]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[13]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[13]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[14]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[14]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[15]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[15]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[16]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[16]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[17]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[17]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[18]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[18]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[19]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[19]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
                <xsl:choose>
                  <xsl:when test="//n1:DespatchAdvice/cac:DespatchLine[20]">
                    <xsl:apply-templates select="//n1:DespatchAdvice/cac:DespatchLine[20]" />
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:apply-templates select="//n1:DespatchAdvice" />
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:if>
            </tbody>
          </table>
        </xsl:for-each>
        <br />
        <table id="budgetContainerTable" width="800px">
          <tr align="right">
            <td />
            <td class="lineTableBudgetTd" align="right" width="129px">
              <span style="font-weight:bold; ">
                <xsl:text>Toplam Miktar</xsl:text>
              </span>
            </td>
            <td class="lineTableBudgetTd" style="width:129px; " align="right">
              <xsl:value-of select="format-number(sum(//./cbc:DeliveredQuantity),'###.##0,00', 'european')" />
            </td>
          </tr>
        </table>
        <br />
        <xsl:if test="//n1:DespatchAdvice/cac:AdditionalDocumentReference">
          <table id="lineTable" width="800">
            <thead>
              <tr>
                <td align="left">
                  <span style="font-weight:bold; " align="center">     İlgili Dokümanlar</span>
                </td>
                <td align="left">
                  <span style="font-weight:bold; " align="center">
                  </span>
                </td>
                <td align="left">
                  <span style="font-weight:bold; " align="center">
                  </span>
                </td>
                <td align="left">
                  <span style="font-weight:bold; " align="center">
                  </span>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr align="left" class="lineTableTr">
                <td class="lineTableTd">
                  <span style="font-weight:bold; " align="center">     Doküman No</span>
                </td>
                <td class="lineTableTd">
                  <span style="font-weight:bold; " align="center">     Tarih</span>
                </td>
                <td class="lineTableTd">
                  <span style="font-weight:bold; " align="center">     Doküman Tipi</span>
                </td>
                <td class="lineTableTd">
                  <span style="font-weight:bold; " align="center">     Açıklama</span>
                </td>
              </tr>
              <xsl:for-each select="//n1:DespatchAdvice/cac:AdditionalDocumentReference">
                <tr align="left" class="lineTableTr">
                  <td class="lineTableTd">
                    <xsl:value-of select="./cbc:ID" />
                  </td>
                  <td class="lineTableTd">
                    <xsl:for-each select="./cbc:IssueDate">
                      <xsl:apply-templates select="." />
                    </xsl:for-each>
                  </td>
                  <td class="lineTableTd">
                    <xsl:value-of select="./cbc:DocumentType" />
                  </td>
                  <td class="lineTableTd">
                    <xsl:value-of select="./cbc:DocumentDescription" />
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </xsl:if>
        <br />
        <table id="notesTable" width="800" align="left">
          <thead>
            <tr>
              <td align="left">
                <span style="font-weight:bold; " align="center">     Açıklamalar</span>
              </td>
              <td align="left">
                <span style="font-weight:bold; " align="center">     Taşıyıcı Bilgileri</span>
              </td>
              <td align="left">
                <span style="font-weight:bold; " align="center">     Teslimat Bilgileri</span>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr align="left">
              <td id="notesTableTd" height="100">
                <xsl:for-each select="//n1:DespatchAdvice/cbc:Note">
                  <b>      Not: </b>
                  <xsl:value-of select="." />
                  <br />
                </xsl:for-each>
                <xsl:for-each select="//cac:SellerSupplierParty">
                  <b>      Asıl Satıcı VKN: </b>
                  <xsl:value-of select="cac:Party/cac:PartyIdentification/cbc:ID" />
                  <br />
                  <b>      Asıl Satıcı Ünvan: </b>
                  <xsl:value-of select="cac:Party/cac:PartyName/cbc:Name" />
                  <br />
                </xsl:for-each>
                <xsl:for-each select="//cac:BuyerCustomerParty">
                  <b>      Asıl Alıcı VKN: </b>
                  <xsl:value-of select="cac:Party/cac:PartyIdentification/cbc:ID" />
                  <br />
                  <b>      Asıl Alıcı Ünvan: </b>
                  <xsl:value-of select="cac:Party/cac:PartyName/cbc:Name" />
                  <br />
                </xsl:for-each>
                <xsl:for-each select="//cac:OriginatorCustomerParty">
                  <b>      İşlemleri Başlatan Alıcı VKN: </b>
                  <xsl:value-of select="cac:Party/cac:PartyIdentification/cbc:ID" />
                  <br />
                  <b>      İşlemleri Başlatan Alıcı Ünvan: </b>
                  <xsl:value-of select="cac:Party/cac:PartyName/cbc:Name" />
                  <br />
                </xsl:for-each>
                <xsl:for-each select="//cac:DespatchSupplierParty/cac:Party/cac:Person">
                  <xsl:if test="cbc:FirstName">
                    <b>      Teslim Eden: </b>
                    <xsl:for-each select="cbc:Title">
                      <xsl:apply-templates />
                      <xsl:text>
                      </xsl:text>
                    </xsl:for-each>
                    <xsl:for-each select="cbc:FirstName">
                      <xsl:apply-templates />
                      <xsl:text>
                      </xsl:text>
                    </xsl:for-each>
                    <xsl:for-each select="cbc:MiddleName">
                      <xsl:apply-templates />
                      <xsl:text>
                      </xsl:text>
                    </xsl:for-each>
                    <xsl:for-each select="cbc:FamilyName">
                      <xsl:apply-templates />
                      <xsl:text>
                      </xsl:text>
                    </xsl:for-each>
                    <xsl:for-each select="cbc:NameSuffix">
                      <xsl:apply-templates />
                    </xsl:for-each>
                    <br />
                  </xsl:if>
                </xsl:for-each>
              </td>
              <td id="notesTableTd" height="100">
                <xsl:for-each select="//cac:CarrierParty">
                  <b>       Taşıyıcı Firma: </b>
                                    VKN: 
                                    <xsl:value-of select="./cac:PartyIdentification/cbc:ID" />, 
                                    <xsl:value-of select="./cac:PartyName/cbc:Name" /><br /></xsl:for-each>
                <xsl:for-each select="//cac:ShipmentStage/cac:TransportMeans/cac:RoadTransport/cbc:LicensePlateID">
                  <b>       Araç plaka numarası: </b>
                  <xsl:value-of select="." />
                  <br />
                </xsl:for-each>
                <xsl:for-each select="//cac:TransportHandlingUnit/cac:TransportEquipment/cbc:ID[@schemeID = 'DORSEPLAKA']">
                  <b>       Dorse plaka numarası: </b>
                  <xsl:value-of select="." />
                  <br />
                </xsl:for-each>
                <xsl:for-each select="//cac:ShipmentStage/cac:DriverPerson">
                  <xsl:if test="cbc:FirstName">
                    <b>       Şoför: </b>
                    <xsl:for-each select="cbc:Title">
                      <xsl:apply-templates />
                      <xsl:text>
                      </xsl:text>
                    </xsl:for-each>
                    <xsl:for-each select="cbc:FirstName">
                      <xsl:apply-templates />
                      <xsl:text>
                      </xsl:text>
                    </xsl:for-each>
                    <xsl:for-each select="cbc:MiddleName">
                      <xsl:apply-templates />
                      <xsl:text>
                      </xsl:text>
                    </xsl:for-each>
                    <xsl:for-each select="cbc:FamilyName">
                      <xsl:apply-templates />
                      <xsl:text>
                      </xsl:text>
                    </xsl:for-each>, TCKN:
                                        
                                        <xsl:for-each select="cbc:NationalityID"><xsl:apply-templates /></xsl:for-each><br /></xsl:if>
                </xsl:for-each>
              </td>
              <td id="notesTableTd" height="100">
                <xsl:for-each select="n1:DespatchAdvice/cac:Shipment/cac:Delivery">
                  <xsl:value-of select="./cac:DeliveryAddress/cbc:StreetName" />
                  <br />
                  <xsl:value-of select="./cac:DeliveryAddress/cbc:CitySubdivisionName" />
                  <xsl:text> / </xsl:text>
                  <xsl:value-of select="./cac:DeliveryAddress/cbc:CityName" />
                  <br />
                </xsl:for-each>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
  <xsl:template match="//n1:DespatchAdvice/cac:DespatchLine">
    <tr class="lineTableTr">
      <td class="lineTableTd">
        <xsl:text>
        </xsl:text>
        <xsl:value-of select="./cbc:ID" />
      </td>
      <td class="lineTableTd">
        <xsl:text>
        </xsl:text>
        <xsl:value-of select="./cac:Item/cbc:Name" />
      </td>
      <td class="lineTableTd" align="right">
        <xsl:text>
        </xsl:text>
        <xsl:value-of select="format-number(./cbc:DeliveredQuantity, '###.###,####', 'european')" />
        <xsl:if test="./cbc:DeliveredQuantity/@unitCode">
          <xsl:for-each select="./cbc:DeliveredQuantity">
            <xsl:text>
            </xsl:text>
            <xsl:choose>
              <xsl:when test="@unitCode  = '26'">
                <xsl:text>ton</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'BX'">
                <xsl:text>Kutu</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'LTR'">
                <xsl:text>lt</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'C62'">
                <xsl:text>Adet</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'NIU'">
                <xsl:text>Adet</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'KGM'">
                <xsl:text>kg</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'KJO'">
                <xsl:text>kJ</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'GRM'">
                <xsl:text>g</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MGM'">
                <xsl:text>mg</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'NT'">
                <xsl:text>Net Ton</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'GT'">
                <xsl:text>Gross Ton</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MTR'">
                <xsl:text>m</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MMT'">
                <xsl:text>mm</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'KTM'">
                <xsl:text>km</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MLT'">
                <xsl:text>ml</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MMQ'">
                <xsl:text>mm3</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'CLT'">
                <xsl:text>cl</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'CMK'">
                <xsl:text>cm2</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'CMQ'">
                <xsl:text>cm3</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'CMT'">
                <xsl:text>cm</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MTK'">
                <xsl:text>m2</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MTQ'">
                <xsl:text>m3</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'DAY'">
                <xsl:text> Gün</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MON'">
                <xsl:text> Ay</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'PA'">
                <xsl:text> Paket</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'KWH'">
                <xsl:text> KWH</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'ANN'">
                <xsl:text> Yıl</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'HUR'">
                <xsl:text> Saat</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'D61'">
                <xsl:text> Dakika</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'D62'">
                <xsl:text> Saniye</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'CCT'">
                <xsl:text> Ton baş.taşıma kap.</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'D30'">
                <xsl:text> Brüt kalori</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'D40'">
                <xsl:text> 1000 lt</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'LPA'">
                <xsl:text> saf alkol lt</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'B32'">
                <xsl:text> kg.m2</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'NCL'">
                <xsl:text> hücre adet</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'PR'">
                <xsl:text> Çift</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'R9'">
                <xsl:text> 1000 m3</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'SET'">
                <xsl:text> Set</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'T3'">
                <xsl:text> 1000 adet</xsl:text>
              </xsl:when>
            </xsl:choose>
          </xsl:for-each>
        </xsl:if>
      </td>
      <td class="lineTableTd" align="right">
        <xsl:text>
        </xsl:text>
        <xsl:value-of select="format-number(./cbc:OutstandingQuantity, '###.###,####', 'european')" />
        <xsl:if test="./cbc:OutstandingQuantity/@unitCode">
          <xsl:for-each select="./cbc:OutstandingQuantity">
            <xsl:text>
            </xsl:text>
            <xsl:choose>
              <xsl:when test="@unitCode  = '26'">
                <xsl:text>ton</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'BX'">
                <xsl:text>Kutu</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'LTR'">
                <xsl:text>lt</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'C62'">
                <xsl:text>Adet</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'NIU'">
                <xsl:text>Adet</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'KGM'">
                <xsl:text>kg</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'KJO'">
                <xsl:text>kJ</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'GRM'">
                <xsl:text>g</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MGM'">
                <xsl:text>mg</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'NT'">
                <xsl:text>Net Ton</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'GT'">
                <xsl:text>Gross Ton</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MTR'">
                <xsl:text>m</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MMT'">
                <xsl:text>mm</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'KTM'">
                <xsl:text>km</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MLT'">
                <xsl:text>ml</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MMQ'">
                <xsl:text>mm3</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'CLT'">
                <xsl:text>cl</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'CMK'">
                <xsl:text>cm2</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'CMQ'">
                <xsl:text>cm3</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'CMT'">
                <xsl:text>cm</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MTK'">
                <xsl:text>m2</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MTQ'">
                <xsl:text>m3</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'DAY'">
                <xsl:text> Gün</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'MON'">
                <xsl:text> Ay</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'PA'">
                <xsl:text> Paket</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'KWH'">
                <xsl:text> KWH</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'ANN'">
                <xsl:text> Yıl</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'HUR'">
                <xsl:text> Saat</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'D61'">
                <xsl:text> Dakika</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'D62'">
                <xsl:text> Saniye</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'CCT'">
                <xsl:text> Ton baş.taşıma kap.</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'D30'">
                <xsl:text> Brüt kalori</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'D40'">
                <xsl:text> 1000 lt</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'LPA'">
                <xsl:text> saf alkol lt</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'B32'">
                <xsl:text> kg.m2</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'NCL'">
                <xsl:text> hücre adet</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'PR'">
                <xsl:text> Çift</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'R9'">
                <xsl:text> 1000 m3</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'SET'">
                <xsl:text> Set</xsl:text>
              </xsl:when>
              <xsl:when test="@unitCode  = 'T3'">
                <xsl:text> 1000 adet</xsl:text>
              </xsl:when>
            </xsl:choose>
          </xsl:for-each>
        </xsl:if>
      </td>
      <td class="lineTableTd" align="right">
        <xsl:text>
        </xsl:text>
        <xsl:value-of select="//n1:Invoice/cac:InvoiceLine" />
        <xsl:if test="./cac:Shipment/cac:GoodsItem/cac:InvoiceLine/cbc:LineExtensionAmount/@currencyID">
          <xsl:text>
          </xsl:text>
          <xsl:if test="./cac:Shipment/cac:GoodsItem/cac:InvoiceLine/cbc:LineExtensionAmount/@currencyID = &quot;TRL&quot; or ./cac:Shipment/cac:GoodsItem/cac:InvoiceLine/cbc:LineExtensionAmount/@currencyID = &quot;TRY&quot;">
            <xsl:text>TL</xsl:text>
          </xsl:if>
          <xsl:if test="./cac:Shipment/cac:GoodsItem/cac:InvoiceLine/cbc:LineExtensionAmount/@currencyID != &quot;TRL&quot; and ./cac:Shipment/cac:GoodsItem/cac:InvoiceLine/cbc:LineExtensionAmount/@currencyID != &quot;TRY&quot;">
            <xsl:value-of select="./cac:Shipment/cac:GoodsItem/cac:InvoiceLine/cbc:LineExtensionAmount/@currencyID" />
          </xsl:if>
        </xsl:if>
      </td>
    </tr>
  </xsl:template>
  <xsl:template match="//cbc:IssueDate">
    <xsl:value-of select="substring(.,9,2)" />-
        <xsl:value-of select="substring(.,6,2)" />-
        <xsl:value-of select="substring(.,1,4)" /></xsl:template>
  <xsl:template match="//cbc:ActualDespatchDate">
    <xsl:value-of select="substring(.,9,2)" />-
        <xsl:value-of select="substring(.,6,2)" />-
        <xsl:value-of select="substring(.,1,4)" /></xsl:template>
  <xsl:template match="//n1:DespatchAdvice">
    <tr class="lineTableTr">
      <td class="lineTableTd">
        <xsl:text>
        </xsl:text>
      </td>
      <td class="lineTableTd">
        <xsl:text>
        </xsl:text>
      </td>
      <td class="lineTableTd" align="right">
        <xsl:text>
        </xsl:text>
      </td>
      <td class="lineTableTd" align="right">
        <xsl:text>
        </xsl:text>
      </td>
      <td class="lineTableTd" align="right">
        <xsl:text>
        </xsl:text>
      </td>
    </tr>
  </xsl:template>
  <xsl:template name="Party_Title">
    <xsl:param name="PartyType" />
    <td style="width:469px; " align="left">
      <xsl:for-each select="cac:Person">
        <xsl:for-each select="cbc:Title">
          <xsl:apply-templates />
          <xsl:text>
          </xsl:text>
        </xsl:for-each>
        <xsl:for-each select="cbc:FirstName">
          <xsl:apply-templates />
          <xsl:text>
          </xsl:text>
        </xsl:for-each>
        <xsl:for-each select="cbc:MiddleName">
          <xsl:apply-templates />
          <xsl:text>
          </xsl:text>
        </xsl:for-each>
        <xsl:for-each select="cbc:FamilyName">
          <xsl:apply-templates />
          <xsl:text>
          </xsl:text>
        </xsl:for-each>
        <xsl:for-each select="cbc:NameSuffix">
          <xsl:apply-templates />
        </xsl:for-each>
        <xsl:if test="$PartyType='TAXFREE'">
          <br />
          <xsl:text>Pasaport No: </xsl:text>
          <xsl:value-of select="cac:IdentityDocumentReference/cbc:ID" />
          <br />
          <xsl:text>Ülkesi: </xsl:text>
          <xsl:value-of select="cbc:NationalityID" />
        </xsl:if>
      </xsl:for-each>
    </td>
  </xsl:template>
  <xsl:template name="Party_Adress">
    <xsl:param name="PartyType" />
    <td style="width:469px; " align="left">
      <xsl:for-each select="cac:PostalAddress">
        <xsl:for-each select="cbc:District">
          <xsl:apply-templates />
        </xsl:for-each>
        <xsl:for-each select="cbc:StreetName">
          <xsl:apply-templates />
          <xsl:text>
          </xsl:text>
        </xsl:for-each>
        <xsl:for-each select="cbc:BuildingName">
          <xsl:apply-templates />
        </xsl:for-each>
        <xsl:for-each select="cbc:BuildingNumber">
          <xsl:text> No:</xsl:text>
          <xsl:apply-templates />
          <xsl:text>
          </xsl:text>
        </xsl:for-each>
        <br />
        <xsl:for-each select="cbc:Room">
          <xsl:text>Kapı No:</xsl:text>
          <xsl:apply-templates />
          <xsl:text>
          </xsl:text>
        </xsl:for-each>
        <br />
        <xsl:for-each select="cbc:PostalZone">
          <xsl:apply-templates />
          <xsl:text>
          </xsl:text>
        </xsl:for-each>
        <xsl:for-each select="cbc:CitySubdivisionName">
          <xsl:apply-templates />
          <xsl:text>/ </xsl:text>
        </xsl:for-each>
        <xsl:for-each select="cbc:CityName">
          <xsl:apply-templates />
          <xsl:text>
          </xsl:text>
        </xsl:for-each>
        <xsl:for-each select="cac:Country/cbc:Name">
          <xsl:apply-templates />
          <xsl:text>
          </xsl:text>
          <xsl:text>
          </xsl:text>
        </xsl:for-each>
        <xsl:if test="$PartyType='TAXFREE'">
          <br />
          <xsl:value-of select="cac:Country/cbc:Name" />
          <br />
        </xsl:if>
      </xsl:for-each>
    </td>
  </xsl:template>
  <xsl:template name="Party_Other">
    <xsl:param name="PartyType" />
    <xsl:for-each select="cbc:WebsiteURI">
      <tr align="left">
        <td>
          <xsl:text>Web Sitesi: </xsl:text>
          <xsl:value-of select="." />
        </td>
      </tr>
    </xsl:for-each>
    <xsl:for-each select="cac:Contact/cbc:ElectronicMail">
      <tr align="left">
        <td>
          <xsl:text>E-Posta: </xsl:text>
          <xsl:value-of select="." />
        </td>
      </tr>
    </xsl:for-each>
    <xsl:for-each select="cac:Contact">
      <xsl:if test="cbc:Telephone or cbc:Telefax">
        <tr align="left">
          <td style="width:469px; " align="left">
            <xsl:for-each select="cbc:Telephone">
              <xsl:text>Tel: </xsl:text>
              <xsl:apply-templates />
            </xsl:for-each>
            <xsl:for-each select="cbc:Telefax">
              <xsl:text> Fax: </xsl:text>
              <xsl:apply-templates />
            </xsl:for-each>
            <xsl:text>
            </xsl:text>
          </td>
        </tr>
      </xsl:if>
    </xsl:for-each>
    <xsl:if test="$PartyType!='TAXFREE'">
      <xsl:for-each select="cac:PartyTaxScheme/cac:TaxScheme/cbc:Name">
        <tr align="left">
          <td>
            <xsl:text>Vergi Dairesi: </xsl:text>
            <xsl:apply-templates />
          </td>
        </tr>
      </xsl:for-each>
      <xsl:for-each select="cac:PartyIdentification">
        <tr align="left">
          <td>
            <xsl:value-of select="cbc:ID/@schemeID" />
            <xsl:text>: </xsl:text>
            <xsl:value-of select="cbc:ID" />
          </td>
        </tr>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>
  <xsl:template name="Curr_Type">
    <xsl:value-of select="format-number(., '###.##0,00', 'european')" />
    <xsl:if test="@currencyID">
      <xsl:text>
      </xsl:text>
      <xsl:choose>
        <xsl:when test="@currencyID = 'TRL' or @currencyID = 'TRY'">
          <xsl:text>TL</xsl:text>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="@currencyID" />
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>
<xsl:variable name="QRSOVOS">
    <xsl:text> https://qr.sovostr.com/qr?data=</xsl:text>
        <xsl:text>{"vkntckn":"</xsl:text>       
        <xsl:value-of select="//cac:DespatchSupplierParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID = 'VKN' or @schemeID = 'TCKN']"/>
        <xsl:text>",</xsl:text>
        <xsl:text>"avkntckn":"</xsl:text>
        <xsl:value-of select="//cac:DeliveryCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID = 'VKN' or @schemeID = 'TCKN']"/>
        <xsl:text>",</xsl:text>
        <xsl:text>"senaryo":"</xsl:text>
        <xsl:value-of select="//cbc:ProfileID"/>
        <xsl:text>",</xsl:text>
        <xsl:text>"tip":"</xsl:text>
        <xsl:value-of select="//cbc:DespatchAdviceTypeCode"/>
        <xsl:text>",</xsl:text>
        <xsl:text>"tarih":"</xsl:text>
        <xsl:value-of select="//cbc:IssueDate"/>
        <xsl:text>",</xsl:text>
        <xsl:text>"no":"</xsl:text>
        <xsl:value-of select="//cbc:ID"/>
        <xsl:text>",</xsl:text>
        <xsl:text>"ettn":"</xsl:text>
        <xsl:value-of select="//cbc:UUID"/>
        <xsl:text>",</xsl:text>
        <xsl:text>"sevktarihi":"</xsl:text>
        <xsl:value-of select="//cac:Shipment/cac:Delivery/cac:Despatch/cbc:ActualDespatchDate"/>
        <xsl:text>",</xsl:text>
        <xsl:text>"sevkzamani":"</xsl:text>
        <xsl:value-of select="substring(//cac:Shipment/cac:Delivery/cac:Despatch/cbc:ActualDespatchTime,1,8)"/>
        <xsl:text>",</xsl:text>
        <xsl:text>"tasiyicivkn":"</xsl:text>
        <xsl:value-of select="//cac:Shipment/cac:Delivery/cac:CarrierParty/cac:PartyIdentification/cbc:ID[@schemeID = 'VKN' or @schemeID = 'TCKN']"/>
        <xsl:text>",</xsl:text>
        <xsl:text>"plaka":"</xsl:text>
        <xsl:value-of select="//cac:Shipment/cac:ShipmentStage/cac:TransportMeans/cac:RoadTransport/cbc:LicensePlateID"/>
        <xsl:text>"}</xsl:text>
</xsl:variable>
</xsl:stylesheet>