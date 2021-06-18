package rest;

import static spark.Spark.get;
import static spark.Spark.port;
import static spark.Spark.staticFiles;

import java.io.File;

import com.google.gson.Gson;

public class SparkAppMain {

	private static Gson g = new Gson();
	
	public static void main(String[] args) throws Exception {
		port(8080);

		//http://localhost:8080/login.html
		//http://localhost:8080/products.html
		staticFiles.externalLocation(new File("./static").getCanonicalPath());
		
		get("rest/test", (req, res) -> {
			return "Works";
		});
	}
}
