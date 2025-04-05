import os
import pdfkit
import tempfile

def gerar_pdf_from_html_bytes(html: str) -> bytes:
    try:
        # Caminho absoluto correto do wkhtmltopdf.exe
        path_wkhtmltopdf = os.path.abspath("wkhtmltopdf/bin/wkhtmltopdf.exe")
        config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)

        temp_html = tempfile.NamedTemporaryFile(delete=False, suffix=".html", mode="w", encoding="utf-8")
        temp_html.write(html)
        temp_html.close()
        print("📄 HTML TEMP:", temp_html.name)

        pdf_bytes = pdfkit.from_file(temp_html.name, False, configuration=config)
        print("✅ PDF gerado com sucesso!")

        os.remove(temp_html.name)
        return pdf_bytes

    except Exception as e:
        import traceback
        print("❌ ERRO COMPLETO:")
        traceback.print_exc()
        raise Exception("Falha ao gerar o PDF.")
