package fileRepository;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

import javax.imageio.ImageIO;

public class ImageFileRepository {

	public ImageFileRepository() {
	}
	
	public String saveImage(String base64ImageUrl) {
		//base64ImageUrl = data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAgAEl...==
		String[] parts = base64ImageUrl.split(",");
		//"data:image/jpeg;base64":
		String[] firstPartParts = parts[0].split("/");
		String extension = firstPartParts[1].split(";")[0];
        
		
		String imageString = parts[1];
		
		BufferedImage image = null;
		byte[] imageByte;
		
		imageByte = Base64.getDecoder().decode(imageString);
		
		ByteArrayInputStream bis = new ByteArrayInputStream(imageByte);
		
		try {
			image = ImageIO.read(bis);
		} catch (IOException e1) {
			e1.printStackTrace();
		} finally {
			try {
				bis.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		// write the image to a file
		String imageName = UUID.randomUUID().toString();
		String path = "images/" + imageName + "." + extension;
		File outputfile = new File(path);
		try {
			ImageIO.write(image, extension, outputfile);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return path;
	}
	
}
