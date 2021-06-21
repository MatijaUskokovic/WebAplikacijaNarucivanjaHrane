package gsonAdapters;

import java.io.IOException;
import java.util.Date;

import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

public class DateAdapter extends TypeAdapter<Date> {

	@Override
	public Date read(JsonReader arg0) throws IOException {
		if (arg0 == null) {
			return null;
		}
		return new Date(arg0.nextLong());
	}

	@Override
	public void write(JsonWriter out, Date value) throws IOException {
		if (value == null) {
			out.nullValue();
			return;
		}
		out.value(value.getTime());
	}

}
