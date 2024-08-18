const petsDict = {
	"meta.title": "{{petName}} | Mascotas",
	"new-pet-heading": "Agrega a tu mascota",
	"new-pet-text-field-label": "Nombre",
	"new-pet-text-field-placeholder": "Garfield",
	"animal-type.dog": "Perro",
	"animal-type.cat": "Gato",
	"animal-type.bird": "Pájaro",
	"animal-type.fish": "Pez",
	"animal-type.rabbit": "Conejo",
	"animal-type.rodent": "Roedor",
	"animal-type.horse": "Caballo",
	"animal-gender": "Género",
	"animal-gender.male": "Macho",
	"animal-gender.female": "Hembra",
	"animal-shortcut.birth-date": "Fecha de nacimiento",
	"animal-shortcut.weight": "Peso",
	"animal-shortcut.nutrition": "Nutrición",
	"animal-shortcut.breed": "Raza",
	"animal-add-weight.label": "Peso de {{name}}",
	"animal-add-birth-date.label": "Fecha de nacimiento de {{name}}",
	"animal-add-birth-date.day": "Día",
	"animal-add-birth-date.month": "Mes",
	"animal-add-birth-date.year": "Año",
	"animal-add-breed.label": "Raza de {{name}}",
	"animal.drawer.cancel": "Más tarde",
	"animal.drawer.save": "Guardar",
	"failure.title": "Hubo un error al guardar los datos.",
	"failure.message": "Esto no es lo esperado, ¡pero la solución seguramente llegará pronto!",
	"cta.create": "Crear",
	"header.all-pets": "Todas",
	"pet-card.edit": "Actualizar",
	"meta.edit-title": "Más sobre {{petName}}",
	"edit.headline": "Más sobre <b>{{petName}}</b>",
	"edit.delete-cta": "Eliminar {{petName}}",
	"edit.photo-update": "Actualizar",
	"edit.photo-add": "Agregar una foto",
	"edit.name": "Nombre",
	"edit.birth-date": "Fecha de nacimiento",
	"edit.birth-day": "Día",
	"edit.birth-month": "Mes",
	"edit.birth-month-none": "-",
	"edit.birth-year": "Año",
	"edit.breed": "Raza",
	"edit.save-cta": "Guardar",
	"edit.photo-update-dialog-title": "Actualizar la foto de {{petName}}",
} as const satisfies Record<keyof typeof import("../en/pets").default, string>;

export default petsDict;
